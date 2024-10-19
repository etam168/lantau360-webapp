<template>
  <q-page>
    <template v-for="(section, index) in renderItems" :key="index">
      <error-widget
        v-if="section.type === 'error'"
        :error="customLocationError as GeoLocationError"
      />
      <loading-widget v-else-if="section.type === 'loading'" />

      <input-template
        v-else-if="section.type === 'location'"
        :item-id="(item as SiteView).siteId"
        :current-address="currentLocationAddress"
        :destination-address="destinationLocationAddress"
        :distance="distanceToDestination"
        :member-config="memberConfig"
        :check-in-data="checkInData"
      />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  import * as geolib from "geolib";

  // Interface files
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { Content } from "@/interfaces/models/entities/content";

  import { SiteView } from "@/interfaces/models/views/site-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  import LoadingWidget from "./sections/loading-widget.vue";
  import InputTemplate from "./sections/input-template.vue";
  // import LoginWidget from "./sections/login-widget.vue";
  import ErrorWidget from "./sections/error-widget.vue";
  import { useGeolocation } from "@vueuse/core";
  import GeoLocationError from "@/interfaces/geo-location-error";
  import { useUserStore } from "@/stores/user";

  import { URL } from "@/constants";

  // Props
  const { item } = defineProps<{
    item: CategoryTypes;
  }>();

  const emits = defineEmits(["on-cancel"]);
  const { coords: userLocation, isSupported, error: locationError } = useGeolocation();

  const currentLocationAddress = ref();
  const destinationLocationAddress = ref();
  const distanceToDestination = ref(0);
  const loading = ref(true);
  const $q = useQuasar();

  const { fetchData } = useApi();
  const userStore = useUserStore();
  const isAuthenticated = ref(userStore.isUserLogon());
  const { eventBus } = useUtilities();
  const customLocationError = ref<GeoLocationError | null>(null);

  const addressErrorCode = 5;
  const deviceSupportErrorCode = 4;
 
  const memberConfig = ref();
  const checkInData = ref();
   
  interface RenderItem {
    name: string;
    type: "error" | "loading" | "location";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (true) {
      case locationError.value != null:
        return [{ name: "error", type: "error" }];
      case loading.value:
        return [{ name: "loading", type: "loading" }];
      default:
        return [{ name: "location", type: "location" }];
    }
  });

  onMounted(() => {
    eventBus.on("on-login-success", () => {
      isAuthenticated.value = userStore.isUserLogon();
    });
  });
  function handleCancel() {
    emits("on-cancel");
  }

  function onLoginSuccess() {
    isAuthenticated.value = userStore.isUserLogon();
  }

  async function getLocationDetails() {
    const { latitude: siteLatitude, longitude: siteLongitude } = item;
    await calculateDistance();
    await getAddressFromCoordinates(
      userLocation.value.latitude,
      userLocation.value.longitude,
      true
    );
    await getAddressFromCoordinates(siteLatitude, siteLongitude, false);
    loading.value = false;
  }

  async function calculateDistance() {
    const { latitude: siteLatitude, longitude: siteLongitude } = item;
    const sourceCoords = {
      latitude: userLocation.value.latitude,
      longitude: userLocation.value.longitude
    };
    const destinationCoords = { latitude: siteLatitude, longitude: siteLongitude };

    distanceToDestination.value = await geolib.getDistance(sourceCoords, destinationCoords);
  }

  async function getAddressFromCoordinates(
    latitude: number,
    longitude: number,
    isCurrentLocation = false
  ) {
    try {
      // Make an HTTP GET request to the Nominatim API endpoint
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      if (isCurrentLocation) {
        currentLocationAddress.value = response.data.display_name;
      } else {
        destinationLocationAddress.value = response.data.display_name;
      }
    } catch (error) {
      loading.value = false;
      customLocationError.value = { code: addressErrorCode } as GeoLocationError;
    }
  }

  watch(
    () => locationError,
    () => {
      loading.value = false;
    },
    { deep: true }
  );

  watch(
    () => isSupported,
    () => {
      if (!isSupported.value)
        customLocationError.value = { code: deviceSupportErrorCode } as GeoLocationError;
      loading.value = false;
    },
    { deep: true }
  );

  watch(
    () => userLocation,
    () => {
      getLocationDetails();
    },
    { deep: true }
  );

  const fetchAllData = async () => {
    try {
      const [memberConfigRes, checkInDataRes] = await Promise.all([
        fetchData<Content>(URL.MEMBER_CONFIG),
        fetchData<CheckIn>(`${URL.MEMBER_SITE_CHECK_IN}/${userStore.userId}/${(item as SiteView).siteId}`)
      ]);

      memberConfig.value = memberConfigRes;
      checkInData.value = checkInDataRes;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
