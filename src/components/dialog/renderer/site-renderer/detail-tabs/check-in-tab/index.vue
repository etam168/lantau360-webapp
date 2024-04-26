<template>
  <template v-if="!isAuthenticated">
    <login-widget @on-cancel="handleCancel" />
  </template>
  <template v-else-if="locationError != null">
    <error-widget :error="locationError as GeoLocationError" />
  </template>
  <template v-else-if="loading">
    <loading-widget />
  </template>

  <template v-else>
    <input-template
      :item-id="(item as SiteView).siteId"
      :current-Address="currentLocationAddress"
      :destination-address="destinationLocationAddress"
      :distance="distanceToDestination"
    />
  </template>
</template>

<script setup lang="ts">
  import * as geolib from "geolib";

  import { SiteView } from "@/interfaces/models/views/site-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  import LoadingWidget from "./loading-widget.vue";
  import InputTemplate from "./input-template.vue";
  import LoginWidget from "./login-widget.vue";
  import ErrorWidget from "./error-widget.vue";
  import { useGeolocation } from "@vueuse/core";
  import GeoLocationError from "@/interfaces/geo-location-error";
  import { useUserStore } from "@/stores/user";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const emits = defineEmits(["on-cancel"]);
  const { coords: userLocation, isSupported, error: locationError } = useGeolocation();

  const currentLocationAddress = ref();
  const destinationLocationAddress = ref();
  const distanceToDestination = ref(0);
  const loading = ref(true);

  const userStore = useUserStore();
  const isAuthenticated = computed(() => userStore.isUserLogon());

  const addressErrorCode = 5;
  const deviceSupportErrorCode = 4;

  function handleCancel() {
    emits("on-cancel");
  }

  async function getLocationDetails() {
    const { latitude: siteLatitude, longitude: siteLongitude } = props.item;
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
    const { latitude: siteLatitude, longitude: siteLongitude } = props.item;
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
      locationError.value = { code: addressErrorCode } as GeoLocationError;
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
        locationError.value = { code: deviceSupportErrorCode } as GeoLocationError;
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
</script>
