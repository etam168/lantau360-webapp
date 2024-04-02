<template>
  <div v-if="loading">
    <loading-widget />
  </div>
  <div v-else-if="geoPermissionStatus === GeolocationPermissionStatus.GRANTED">
    {{ "Site Location:  " + "Lat: " + item.latitude + " - " + " Lng: " + item.longitude }}
    <br />
    {{
      "Current User Location: " + "Lat: " + currentLatitude + " - " + " Lng: " + currentLongitude
    }}

    <br />
    {{ "Distance in meters: " + distanceToDestination + " m" }}
    <br />
    <q-btn @click="checkIn">CheckIn</q-btn>
  </div>
  <div v-else>Please turn localtion feature the settings</div>
</template>

<script setup lang="ts">
  import * as geolib from "geolib";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { useUserStore } from "@/stores/user";
  import { handlePermission, GeolocationPermissionStatus } from "@/composable/geo_permission";
  import { useQuasar } from "quasar";

  import LoadingWidget from "./loading-widget.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const userStore = useUserStore();
  const $q = useQuasar();

  const currentLatitude = ref(0);
  const currentLongitude = ref(0);
  const distanceToDestination = ref(0);
  const geoPermissionStatus = ref(GeolocationPermissionStatus.DENIED);

  const loading = ref(false);

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

  function checkIn() {
    if (!userStore.isUserLogon()) {
      showLoginDialog();
      return;
    }
    openCheckInDialog();
  }
  function openCheckInDialog() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/checkin-dialog.vue")),
      componentProps: {
        userLocation: {
          lat: currentLatitude.value,
          lng: currentLatitude.value
        },
        itemId: (props.item as SiteView).siteId
      }
    });
  }
  function showLoginDialog() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        callback: openCheckInDialog
      }
    });
  }
</script>
