import type { CategoryTypes } from '@/interfaces/types/category-types';
import { useGeolocation } from '@vueuse/core';
import { useUserStore } from "@/stores/user";
import L from 'leaflet';
import { EntityURLKey } from '@/constants';

export function useCheckInDataService(memberConfig:any, checkInData: any) {
  const {  notify } = useUtilities();
  const distanceToDestination = ref(0);
  const timeUntilNextCheckIn = ref(0);
  const { coords: userLocation } = useGeolocation();

  const performCheckIn = async (entityKey: EntityURLKey, category: CategoryTypes) => {
    await checkRecentCheckInStatus();

    if (timeUntilNextCheckIn.value > 0) {
      notify(`You must wait ${timeUntilNextCheckIn.value} minutes before checking in again.`, "primary");
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

      const checkInModifiedAt = checkIn?.modifiedAt
        ? new Date(checkIn.modifiedAt).getTime()
        : 0;

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

  const openCheckInDialog = (props) => {
    alert("openCheckInDialog");
    // Implement your dialog opening logic here
    // Example: Use a dialog service to open the check-in dialog with the props
  };

  return { distanceToDestination, timeUntilNextCheckIn, performCheckIn };
}