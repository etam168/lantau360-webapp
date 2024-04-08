<template>
  <template v-if="!isAuthenticated">
    <login-widget />
  </template>
  <template v-else-if="loading">
    <loading-widget />
  </template>
  <template v-else-if="isPermissionDenied">
    <permission-denied-wiget />
  </template>
  <template v-else-if="geoPermissionStatus === GeolocationPermissionStatus.GRANTED">
    <input-template
      :item-id="(item as SiteView).siteId"
      :current-Address="currentLocationAddress"
      :destination-address="destinationLocationAddress"
      :distance="distanceToDestination"
    />
  </template>
  <template
    ><div>{{ $t("home.turnOnLocation") }}</div></template
  >
</template>

<script setup lang="ts">
  import * as geolib from "geolib";

  import { SiteView } from "@/interfaces/models/views/site-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GeolocationPermissionStatus } from "@/composable/geo_permission";

  import LoadingWidget from "./loading-widget.vue";
  import InputTemplate from "./input-template.vue";
  import LoginWidget from "./login-widget.vue";
  import PermissionDeniedWiget from "./permission-denied-widget.vue";

  import { useUserStore } from "@/stores/user";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const userCooords = inject("userPosition") as Ref<GeolocationCoordinates>;
  const currentLocationAddress = ref();
  const destinationLocationAddress = ref();

  const distanceToDestination = ref(0);
  const geoPermissionStatus = ref(GeolocationPermissionStatus.DENIED);

  const loading = ref(false);

  const userStore = useUserStore();
  const isAuthenticated = computed(() => userStore.isUserLogon());
  const isPermissionDenied = ref(false);

  onMounted(() => {
    checkGeoPermissionState();
  });

  async function checkGeoPermissionState() {
    try {
      const { status } = await handlePermission();
      geoPermissionStatus.value = status;
      switch (status) {
        case GeolocationPermissionStatus.GRANTED:
          loading.value = true;
          getLocation();
          break;

        case GeolocationPermissionStatus.DENIED:
          isPermissionDenied.value = true;
          break;
        default:
          console.log("Unknown geolocation permission status.");
          break;
      }
    } catch (error) {
      console.error("Error occurred while requesting geolocation permission:", error);
    }
  }

  async function getLocation() {
    const { latitude, longitude } = props.item;

    calculateDistance();
    await getAddressFromCoordinates(userCooords.value.latitude, userCooords.value.longitude, true);
    await getAddressFromCoordinates(latitude, longitude, false);
    loading.value = false;
  }

  const calculateDistance = () => {
    const { latitude, longitude } = props.item;
    const sourceCoords = {
      latitude: userCooords.value.latitude,
      longitude: userCooords.value.longitude
    };
    const destinationCoords = { latitude, longitude };

    distanceToDestination.value = geolib.getDistance(sourceCoords, destinationCoords);
  };

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
      console.error("Error fetching address:", error);
    }
  }
</script>
