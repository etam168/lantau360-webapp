// Types
import type { CheckIn } from "@/interfaces/models/entities/checkin";
import type { SiteView } from "@/interfaces/models/views/site-view";
import { newCheckInView, type CheckInView } from "@/interfaces/models/views/checkin-view";

// Store and Composables
import { defineStore } from "pinia";
import { useUserStore } from "@/stores/user";

// Other 3rd party
import typia from "typia";

// Utilities
import { LocalStorage } from "quasar";
import { ENTITY_URL, STORAGE_KEYS } from "@/constants";

const { api, fetchData } = useApi();
const userStore = useUserStore();

async function syncCheckIn(checkInView: CheckInView) {
  try {
    if (!userStore.isUserLogon()) {
      return;
    }

    const pruneCheckin = typia.misc.createPrune<CheckIn>();
    const checkInPayload = JSON.parse(JSON.stringify(checkInView));
    pruneCheckin(checkInPayload);

    await api.create(`${ENTITY_URL.CHECKIN}`, checkInPayload);
  } catch (error) {
    throw error;
  }
}

export const useCheckInStore = defineStore(
  "checkin",
  () => {
    // State
    const checkInSites = ref<CheckInView[]>(
      (LocalStorage.getItem(STORAGE_KEYS.SAVED.CHECK_IN_SITES) || []) as CheckInView[]
    );
    const lastSyncCheckedAt = ref<Date>(new Date());

    // Main check-in functions
    async function addOrUpdateCheckIn(site: SiteView, description: string) {
      const checkInfo = {
        checkInAt: new Date().toISOString(),
        description
      };

      const index = checkInSites.value.findIndex(c => c.siteId === site.siteId);

      try {
        const updatedCheckIn =
          index === -1
            ? await createNewCheckIn(site, checkInfo)
            : await updateExistingCheckIn(checkInSites.value[index], checkInfo);

        if (index === -1) {
          checkInSites.value.push(updatedCheckIn);
        } else {
          checkInSites.value[index] = updatedCheckIn;
        }

        await syncCheckIn(updatedCheckIn);
      } catch (error) {
        console.error("Error in check-in operation:", error);
        throw error; // Re-throw to allow parent components to handle
      }
    }

    function createNewCheckIn(site: SiteView, checkInfo: Record<string, any>) {
      return {
        ...JSON.parse(JSON.stringify(newCheckInView)),
        memberId: userStore.userInfo.userId,
        createdBy: userStore.userInfo.userId,
        modifiedBy: userStore.userInfo.userId,
        siteId: site.siteId,
        checkInfo: [checkInfo],
        siteData: site
      };
    }

    function updateExistingCheckIn(existingCheckIn: any, checkInfo: Record<string, any>) {
      return {
        ...existingCheckIn,
        checkInfo: [...existingCheckIn.checkInfo, checkInfo],
        modifiedAt: new Date(),
        modifiedBy: userStore.userInfo.userId
      };
    }

    async function isCheckInInSync(): Promise<boolean> {
      try {
        // Fetch data from the API
        const checkInResponse = await fetchData(
          `${ENTITY_URL.CHECKIN_DATA_IDS}/${userStore.userInfo.userId}`
        );

        // Create a helper function to format DateTime to "HH:mm"
        const formatTime = (dateString: any) => {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
        };

        // Create a mapping of siteId to checkIn times (formatted)
        const apiCheckInMap = new Map();

        checkInResponse.forEach((site: any) => {
          apiCheckInMap.set(
            site.siteId,
            site.checkInInfo.map((checkIn: any) => formatTime(checkIn))
          );
        });

        // Check for each local storage check-in if it exists in the API response
        const isInSync = checkInSites.value.every(localCheckIn => {
          const siteId = localCheckIn.siteId;
          const localTimes = localCheckIn.checkInfo.map(info => formatTime(info.checkInAt));

          // Get the corresponding API times
          const apiTimes = apiCheckInMap.get(siteId) || [];

          // Check if all local times exist in API times
          return localTimes.every(localTime => apiTimes.includes(localTime));
        });

        lastSyncCheckedAt.value = new Date(); // Update last sync time

        return isInSync;
      } catch (error) {
        console.error("Error checking sync:", error);
        throw error;
      }
    }

    function isCheckIn(site: SiteView): boolean {
      return checkInSites.value.some(checkin => checkin.siteId === site.siteId);
    }

    async function syncLocalFromRemote(): Promise<void> {
      try {
        checkInSites.value = await fetchData(`${ENTITY_URL.CHECKIN_DATA}/${userStore.userInfo.userId}`);
      } catch (error) {
        throw error;
      }
    }

    async function syncRemoteFromLocal(): Promise<void> {
      try {
        if (!userStore.isUserLogon()) {
          console.warn("User is not logged in. Cannot sync remote data.");
          return;
        }

        // Construct the payload
        const payload = checkInSites.value.map(item => ({
          siteId: item.siteId,
          checkInfo: item.checkInfo
        }));

        // Check if the user is logged in
        if (!userStore.isUserLogon()) {
          console.warn("User is not logged in. Cannot sync check-in data.");
          return;
        }

        // API call to update check-in data
        const url = `${ENTITY_URL.CHECKIN_UPDATE}/${userStore.userInfo.userId}`;
        await api.update(url, payload);

        console.log("Check-in data synced successfully.");
      } catch (error) {
        console.error("Error syncing check-in data:", error);
        throw error;
      }
    }

    return {
      checkInSites,
      lastSyncCheckedAt,
      addOrUpdateCheckIn,
      isCheckInInSync,
      isCheckIn,
      syncLocalFromRemote,
      syncRemoteFromLocal
    };
  },
  {
    persist: true
  }
);
