import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { Content } from "@/interfaces/models/entities/content";
import type { CheckIn } from "@/interfaces/models/entities/checkin";
import { useGeolocation } from "@vueuse/core";
import L from "leaflet";
import { ENTITY_URL } from "@/constants";
import { useUserStore } from "@/stores/user";
import { SiteView } from "@/interfaces/models/views/site-view";
import { useMember } from "@/composable/use-member";

export function useCheckInDataService() {
  const $q = useQuasar();
  const member = useMember();
  const userStore = useUserStore();
  const { handleOpenDialog } = useEntityDataHandlingService();
  const { fetchData } = useApi();
  const { notify } = useUtilities();
  const distanceToDestination = ref(0);
  const timeUntilNextCheckIn = ref(0);
  const { coords: userLocation } = useGeolocation();

  function openCheckInDialog(category: CategoryTypes) {
    const isDialogOpen = ref(false);
    const props = { associatedEntityId: (category as SiteView).siteId, entityKey: "CHECKIN" };
    handleOpenDialog(props, isDialogOpen, "CHECKIN");
  }

  function isOutOfRange(category: CategoryTypes) {
    const sourcePoint = L.latLng(userLocation.value.latitude, userLocation.value.longitude);
    const destinationPoint = L.latLng(category.latitude, category.longitude);

    // Returns distance in meters
    const distance = sourcePoint.distanceTo(destinationPoint);

    // Returns true if distance is greater than 10 meters
    return distance > 10;
  }

  async function hasLast24HrsCheckIn(category: CategoryTypes) {
    try {
      const [memberConfigRes, checkInDataRes] = await Promise.all([
        fetchData<Content>(ENTITY_URL.MEMBER_CONFIG),
        fetchData<CheckIn>(
          `${ENTITY_URL.MEMBER_SITE_CHECK_IN}/${userStore.userId}/${(category as SiteView).siteId}`
        )
      ]);

      const config = memberConfigRes;
      const checkIn = checkInDataRes;

      const configTimeDifferenceInHours = config?.meta?.checkInTimeDifferenceInHours ?? 1;
      const configTimeDifferenceInMinutes = configTimeDifferenceInHours * 60;

      const checkInModifiedAt = checkIn?.modifiedAt ? new Date(checkIn.modifiedAt).getTime() : 0;

      const currentTime = new Date().getTime();
      const timeDifferenceInMilliseconds = currentTime - checkInModifiedAt;
      const timeDifferenceInMinutes = Math.abs(timeDifferenceInMilliseconds / (1000 * 60));

      const minutesLeftToRecheckIn = configTimeDifferenceInMinutes - timeDifferenceInMinutes;

      if (minutesLeftToRecheckIn >= 0) {
        timeUntilNextCheckIn.value = Math.ceil(minutesLeftToRecheckIn); // Round up to nearest minute
        return true;
      } else {
        timeUntilNextCheckIn.value = 0; // User can check in now
        return false;
      }
    } catch (error) {
      console.error("Error fetching member check-in details:", error);
      throw error;
    }
  }

  async function requestCheckIn(category: CategoryTypes) {
    try {
      switch (true) {
        case userStore.isUserLogon() == false:
          member.promptUserLogon();
          return;
        case isOutOfRange(category):
          notify("You must be under 100 meters of location for check-in", "primary");
          return;
        case await hasLast24HrsCheckIn(category):
          notify(
            `You must wait ${timeUntilNextCheckIn.value} minutes before checking in again.`,
            "primary"
          );
          return;
        default:
          openCheckInDialog(category);
          break;
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
