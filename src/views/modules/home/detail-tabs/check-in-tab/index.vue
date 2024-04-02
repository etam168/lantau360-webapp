<template>
  <template v-if="!isAuthenticated">
    <login-widget />
  </template>
  <template v-else-if="loading">
    <loading-widget />
  </template>
  <template v-else-if="geoPermissionStatus === GeolocationPermissionStatus.GRANTED">
    <input-template :item-id="(item as SiteView).siteId" />
  </template>
  <template v-else>Please turn localtion feature the settings</template>
</template>

<script setup lang="ts">
  import * as geolib from "geolib";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { handlePermission, GeolocationPermissionStatus } from "@/composable/geo_permission";

  import LoadingWidget from "./loading-widget.vue";
  import InputTemplate from "./input-template.vue";
  import LoginWidget from "./login-widget.vue";

  import { useUserStore } from "@/stores/user";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const currentLatitude = ref(0);
  const currentLongitude = ref(0);
  const distanceToDestination = ref(0);
  const geoPermissionStatus = ref(GeolocationPermissionStatus.DENIED);

  const loading = ref(false);

  const userStore = useUserStore();
  const isAuthenticated = computed(() => userStore.isUserLogon());

  onMounted(() => {
    checkGeoPermissionState();
  });

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(({ coords }) => {
        currentLatitude.value = coords.latitude;
        currentLongitude.value = coords.longitude;
        calculateDistance();
      });
    }
  }

  const calculateDistance = () => {
    const { latitude, longitude } = props.item;
    const sourceCoords = { latitude: currentLatitude.value, longitude: currentLongitude.value };
    const destinationCoords = { latitude, longitude };

    distanceToDestination.value = geolib.getDistance(sourceCoords, destinationCoords);
    loading.value = false;
  };

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
          console.log("Geolocation permission denied.");
          break;
        default:
          console.log("Unknown geolocation permission status.");
          break;
      }
    } catch (error) {
      console.error("Error occurred while requesting geolocation permission:", error);
    }
  }
</script>
