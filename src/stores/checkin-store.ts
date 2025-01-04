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
const MAX_CHECKINS = 100;

async function syncCheckIn(checkInView: CheckInView) {
  try {
    if (!userStore.isUserLogon()) {
      return;
    }

    const pruneCheckin = typia.misc.createPrune<CheckIn>();
    const checkInPayload = structuredClone(checkInView)
    pruneCheckin(checkInPayload);

    await api.create(`${ENTITY_URL.CHECKIN}`, checkInPayload);
  } catch (error) {
    throw error;
  }
}

async function deleteCheckIn(deleteUrl: string) {
  try {
    if (!userStore.isUserLogon()) {
      return;
    }
    // to do
    // await api.delete(deleteUrl);
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
      try {
        const checkInfo = {
          checkInAt: new Date().toISOString(),
          description: description // Use description from checkInfo here
        };

        const index = checkInSites.value.findIndex(c => c.siteId === site.siteId);
        if (index === -1) {
          // New check-in
          await addNewCheckIn(site, checkInfo);
        } else {
          // Update existing check-in (reactive)
          await updateCheckIn(index, checkInfo);
        }
      } catch (error) {
        console.error("Error adding check-in:", error);
      }
    }

    async function addNewCheckIn(site: SiteView, checkInfo: Record<string, any>) {
      try {
        // New check-in
        const checkinView = structuredClone(newCheckInView);
        checkinView.memberId = userStore.userId;
        checkinView.createdBy = userStore.userId;
        checkinView.modifiedBy = userStore.userId;
        checkinView.siteId = site.siteId;
        checkinView.checkInfo = [checkInfo];
        checkinView.siteData = site;
        //  checkinView.siteData = structuredClone(site);

        // Add new check-in to array (reactive)
        checkInSites.value.push(checkinView);

        // Optionally, sync with backend
        await syncCheckIn(checkinView);
      } catch (error) {
        throw error;
      }
    }

    async function updateCheckIn(index: number, checkInfo: Record<string, any>) {
      try {
        // Update existing check-in (reactive)
        const existingCheckIn = checkInSites.value[index];
        const updatedCheckIn = {
          ...existingCheckIn,
          checkInfo: [...existingCheckIn.checkInfo, checkInfo],
          modifiedAt: new Date(),
          modifiedBy: userStore.userId
        };

        // Update the existing check-in (reactive)
        checkInSites.value[index] = updatedCheckIn;

        // Optionally, sync with backend
        await syncCheckIn(updatedCheckIn);
      } catch (error) {
        throw error;
      }
    }

    async function isCheckInInSync(): Promise<boolean> {
      try {
        // Fetch data from the API
        const checkInResponse = await fetchData(`${ENTITY_URL.CHECKIN_DATA}/${userStore.userId}`);

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

    async function removeCheckIn(checkIn: CheckInView) {
      checkInSites.value = checkInSites.value.filter(checkin => checkin.siteId !== checkIn.siteId);
      //to do
      // await deleteCheckIn(`${ENTITY_URL.FAVOURITE_SITE}/BySiteId/${checkIn.siteId}`);
    }

    async function syncLocalFromRemote(): Promise<void> {
      try {
        const checkInData = await fetchData(`${ENTITY_URL.FAVOURITE_DATA}/${userStore.userId}`);
        checkInSites.value = checkInData.sites;
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
          checkInFO: item.checkInfo
        }));

        // Check if the user is logged in
        if (!userStore.isUserLogon()) {
          console.warn("User is not logged in. Cannot sync check-in data.");
          return;
        }

        // API call to update check-in data
        const url = `${ENTITY_URL.CHECKIN_UPDATE}/${userStore.userId}`;
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
