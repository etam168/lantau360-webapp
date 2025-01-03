// Types
import type { CheckIn } from "@/interfaces/models/entities/checkin";
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

async function syncCheckIn(upsertUrl: string, checkIn: CheckIn) {
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
    const checkInSites = ref<CheckIn[]>(
      (LocalStorage.getItem(STORAGE_KEYS.CHECKIN.SITE) || []) as CheckIn[]
    );
    const lastSyncCheckedAt = ref<Date>(new Date());
    const serverSites = ref<[]>([]);

    // Main check-in functions
    async function addCheckIn(checkIn: CheckIn) {
      try {
        if (!checkInSites.value.some(c => c.siteId === checkIn.siteId)) {
          if (checkInSites.value.length >= MAX_CHECKINS) {
            return;
          }
        }
        checkInSites.value.push(checkIn);
        // to do
        await syncCheckIn(ENTITY_URL.CHECKIN, checkIn);
      } catch (error) {
        throw error;
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

    async function removeCheckIn(checkIn: CheckIn) {
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
      syncRemoteFromLocal,
    };
  },
  {
    persist: true
  }
);
