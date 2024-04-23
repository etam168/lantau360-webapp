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
  <!-- <div>
    <button @click="getLocationTest()">Get Location</button>
    <div v-if="location">
      Latitude: {{ location.latitude }}, Longitude: {{ location.longitude }}
    </div>
  </div> -->
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
  // import { useGeolocation } from "@vueuse/core";

  // const { coords } = useGeolocation();
  import { useUserStore } from "@/stores/user";
  const { notify } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });
  const location = ref();
  const currentLocationAddress = ref();
  const destinationLocationAddress = ref();

  const distanceToDestination = ref(0);
  const geoPermissionStatus = ref(GeolocationPermissionStatus.DENIED);

  const loading = ref(false);

  const userStore = useUserStore();
  const isAuthenticated = computed(() => userStore.isUserLogon());
  const isPermissionDenied = ref(false);

  onMounted(() => {
    // checkGeoPermissionState();
    getCurrentLocation();
  });

  async function checkGeoPermissionState() {
    try {
      const { status } = await handlePermission();
      geoPermissionStatus.value = status;
      switch (status) {
        case GeolocationPermissionStatus.GRANTED:
          loading.value = true;
          getLocationDetails();
          break;
        case GeolocationPermissionStatus.DENIED:
          isPermissionDenied.value = true;
          alert("User denied the request for geolocation.");
          break;
        default:
          alert("Unknown geolocation permission status.");
          break;
      }
    } catch (error) {
      console.error("Error occurred while requesting geolocation permission:", error);
    }
  }

  async function getLocationDetails() {
    const { latitude, longitude } = props.item;
    await calculateDistance();
    await getAddressFromCoordinates(location.value.latitude, location.value.longitude, true);
    await getAddressFromCoordinates(latitude, longitude, false);
    loading.value = false;
  }

  async function calculateDistance() {
    const { latitude, longitude } = props.item;
    const sourceCoords = {
      latitude: location.value.latitude,
      longitude: location.value.longitude
    };
    const destinationCoords = { latitude, longitude };

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
      console.error("Error fetching address:", error);
    }
  }

  const getCurrentLocation = () => {
    loading.value = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      notify("Geolocation is not supported by this browser.", "negative");
    }
  };

  const onSuccess = (position: GeolocationPosition) => {
    location.value = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    checkGeoPermissionState();
  };

  const onError = (error: GeolocationPositionError) => {
    loading.value = false;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        notify("User denied the request for geolocation.", "negative");
        break;
      case error.POSITION_UNAVAILABLE:
        notify("Location information is unavailable.", "negative");
        break;
      case error.TIMEOUT:
        notify("The request to get user location timed out.", "negative");
        break;
      default:
        notify("An unknown error occurred.", "negative");
        break;
    }
  };
</script>
