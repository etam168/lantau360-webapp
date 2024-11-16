import type { CategoryTypes } from "@/interfaces/types/category-types";
import { useGeolocation } from "@vueuse/core";
import L from "leaflet";
import { EntityURLKey } from "@/constants";
import { useUserStore } from "@/stores/user";

export function useCheckInDataService() {
  // Reactive variables
  const memberConfig = ref();
  const checkInData = ref();

  const userStore = useUserStore();

  const { notify } = useUtilities();
  const distanceToDestination = ref(0);
  const timeUntilNextCheckIn = ref(0);
  const { coords: userLocation } = useGeolocation();

  const performCheckIn = async (entityKey: EntityURLKey, category: CategoryTypes) => {
    await checkRecentCheckInStatus();

    if (timeUntilNextCheckIn.value > 0) {
      notify(
        `You must wait ${timeUntilNextCheckIn.value} minutes before checking in again.`,
        "primary"
      );
      return; // Exit if the user can't check in yet
    }

    await getDistanceToDestination(category);
    if (distanceToDestination.value > 100) {
      notify("You must be under 100 meters of location for check-in", "primary");
    } else {
      handleCheckIn(entityKey, category);
    }
  };

  const getDistanceToDestination = async (category: CategoryTypes) => {
    const { latitude: siteLatitude, longitude: siteLongitude } = category;
    const sourcePoint = L.latLng(userLocation.value.latitude, userLocation.value.longitude);
    const destinationPoint = L.latLng(siteLatitude, siteLongitude);

    // Returns distance in meters
    distanceToDestination.value = sourcePoint.distanceTo(destinationPoint);
  };

  const checkRecentCheckInStatus = async () => {
    try {
      const config = memberConfig.value;
      const checkIn = checkInData.value;

      const configTimeDifferenceInHours = config?.meta?.checkInTimeDifferenceInHours ?? 1;
      const configTimeDifferenceInMinutes = configTimeDifferenceInHours * 60;

      const checkInModifiedAt = checkIn?.modifiedAt ? new Date(checkIn.modifiedAt).getTime() : 0;

      const currentTime = new Date().getTime();
      const timeDifferenceInMilliseconds = currentTime - checkInModifiedAt;
      const timeDifferenceInMinutes = Math.abs(timeDifferenceInMilliseconds / (1000 * 60));

      const minutesLeftToRecheckIn = configTimeDifferenceInMinutes - timeDifferenceInMinutes;

      if (minutesLeftToRecheckIn >= 0) {
        timeUntilNextCheckIn.value = Math.ceil(minutesLeftToRecheckIn); // Round up to nearest minute
      } else {
        timeUntilNextCheckIn.value = 0; // User can check in now
      }
    } catch (err) {
      console.error("Error checking recent check-in status:", err);
    }
  };

  const handleCheckIn = (entityKey: EntityURLKey, category: CategoryTypes) => {
    const props = { associatedEntityId: category.siteId, entityKey: entityKey };
    // Assuming you have a dialog handling service
    openCheckInDialog(props);
  };

  const openCheckInDialog = props => {
    alert("openCheckInDialog");
    // Implement your dialog opening logic here
    // Example: Use a dialog service to open the check-in dialog with the props
  };

  function promptUserLogon() {
    // $q.dialog({
    //   component: defineAsyncComponent(() => import("@/components/dialog/login-alert-dialog.vue")),
    //   componentProps: {
    //     mode: "login"
    //   }
    // });
  }

  function isOutOfRange(category: CategoryTypes) {
    const sourcePoint = L.latLng(userLocation.value.latitude, userLocation.value.longitude);
    const destinationPoint = L.latLng(category.latitude, category.longitude);

    // Returns distance in meters
    const distance = sourcePoint.distanceTo(destinationPoint);

    // Returns true if distance is greater than 10 meters
    return distance > 10;
  }

  function hasLast24HrsCheckIn(category: CategoryTypes) {
    return false;
  }

  function requestCheckIn(category: CategoryTypes) {
    try {
      switch (true) {
        case userStore.isUserLogon() == false:
          promptUserLogon();
          return;
        case isOutOfRange(category):
          notify("You must be under 100 meters of location for check-in", "primary");
          return;
        case hasLast24HrsCheckIn(category):
          notify("You must be under 100 meters of location for check-in", "primary");
          return;
      }
    } catch {
      // kk
    }
  }

  return {
    distanceToDestination,
    timeUntilNextCheckIn,
    requestCheckIn
  };
}
