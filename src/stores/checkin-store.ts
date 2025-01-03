// Types
import type { CheckInView } from "@/interfaces/models/views/checkin-view";
import type { SiteView } from "@/interfaces/models/views/site-view";

// Store and Composables
import { defineStore } from "pinia";
import { useUserStore } from "@/stores/user";

// Utilities
import { LocalStorage } from "quasar";
import { ENTITY_URL, STORAGE_KEYS } from "@/constants";

const { api, fetchData } = useApi();
const userStore = useUserStore();
const MAX_CHECKINS = 100;

async function syncCheckIn(upsertUrl: string, checkIn: CheckInView) {
  try {
    if (!userStore.isUserLogon()) {
      return;
    }

    // const payload = {
    //   memberId: userStore.userId,
    //   entityId: id
    // };

    await api.create(upsertUrl, checkIn);
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
    async function addCheckIn(site: SiteView) {
      try {
        const newCheckInEntry = {
          checkInAt: new Date().toISOString(),
          description: site.description
        };

        const index = checkInSites.value.findIndex(c => c.siteId === site.siteId);

        if (index === -1) {
          // New check-in
          const newCheckIn: CheckInView = {
            checkInId: 0,
            memberId: userStore.userId,
            siteId: site.siteId,
            checkInfo: [newCheckInEntry],
            createdAt: new Date(),
            createdBy: userStore.userId,
            modifiedAt: new Date(),
            modifiedBy: userStore.userId,
            meta: {},
            siteData: site
          };

          // Add new check-in to array (reactive)
          checkInSites.value.push(newCheckIn);
        } else {
          // Update existing check-in (reactive)
          const existingCheckIn = checkInSites.value[index];
          const updatedCheckIn = {
            ...existingCheckIn,
            checkInfo: [...existingCheckIn.checkInfo, newCheckInEntry],
            modifiedAt: new Date(),
            modifiedBy: userStore.userId
          };

          // Update the existing check-in (reactive)
          checkInSites.value[index] = updatedCheckIn;
        }

        // Optionally, sync with backend
        // await syncCheckIn(ENTITY_URL.CHECKIN, checkInSites.value[index]);
      } catch (error) {
        console.error("Error adding check-in:", error);
      }
    }

    async function isCheckInInSync(): Promise<boolean> {
      try {
        // to do
        const checkIn = await fetchData(`${ENTITY_URL.FAVOURITE_DATA_IDS}/${userStore.userId}`);
        const siteIds = checkIn.sites;

        if (siteIds.length !== checkInSites.value.length) {
          return false;
        }

        const isInSync = checkInSites.value.every(site => siteIds.has(site.siteId));
        lastSyncCheckedAt.value = new Date();

        return isInSync;
      } catch (error) {
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

        const payload = {
          sites: checkInSites.value.map(s => s.siteId)
        };

        const url = `${ENTITY_URL.FAVOURITE_UPDATE}/${userStore.userId}`;
        await api.update(url, payload);
      } catch (error) {
        console.error("Error syncing remote data:", error);
        throw error;
      }
    }

    return {
      checkInSites,
      lastSyncCheckedAt,
      addCheckIn,
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
