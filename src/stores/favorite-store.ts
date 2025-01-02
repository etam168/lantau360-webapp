// Types
import type { SiteView } from "@/interfaces/models/views/site-view";
import type { BusinessView } from "@/interfaces/models/views/business-view";

// Store
import { defineStore } from "pinia";
import { useUserStore } from "@/stores/user";

// Constants
import { LocalStorage } from "quasar";
import { ENTITY_URL, STORAGE_KEYS } from "@/constants";

const { api, fetchData } = useApi();
const userStore = useUserStore();
const MAX_FAVORITES = 100;

async function syncFavorite(upsertUrl: string, id: number) {
  try {
    const payload = {
      memberId: userStore.userId,
      entityId: id
    };

    await api.create(`${upsertUrl}`, payload);
  } catch (error) {
    throw error;
  }
}

async function deleteFavorite(deleteUrl: string) {
  try {
    if (userStore.isUserLogon()) {
      await api.delete(deleteUrl);
    }
  } catch (error) {
    throw error; // Rethrow any caught errors
  }
}

export const useFavoriteStore = defineStore(
  "favorite",
  () => {
    const favoriteSites = ref<SiteView[]>(
      (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[]
    );

    const favoriteBusinesses = ref<BusinessView[]>(
      (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[]
    );

    const lastSyncCheckedAt = ref<Date>(new Date());
    const serverBusinesses = ref<[]>([]);
    const serverSites = ref<[]>([]);

    // Business favorites
    async function addBusinessFavorite(business: BusinessView) {
      if (!favoriteBusinesses.value.some(fav => fav.businessId === business.businessId)) {
        if (favoriteBusinesses.value.length >= MAX_FAVORITES) {
          return;
        }

        // Update state first (optimistic)
        favoriteBusinesses.value.push(business);
        await syncFavorite(ENTITY_URL.FAVOURITE_BUSINESS_UPSERT, business.businessId);
      }
    }

    // Site favorites
    async function addSiteFavorite(site: SiteView) {
      if (!favoriteSites.value.some(fav => fav.siteId === site.siteId)) {
        if (favoriteSites.value.length >= MAX_FAVORITES) {
          return;
        }

        // Update state first (optimistic)
        favoriteSites.value.push(site);
        await syncFavorite(ENTITY_URL.FAVOURITE_SITE_UPSERT, site.siteId);
      }
    }

    function isBusinessFavorite(business: BusinessView): boolean {
      return favoriteBusinesses.value.some(fav => fav.businessId === business.businessId);
    }

    async function isFavoritesInSync(): Promise<boolean> {
      try {
        const favourite = await fetchData(`${ENTITY_URL.FAVOURITE_DATA}/${userStore.userId}`);

        // Update server data
        const siteIds = favourite.sites;
        const businessIds = favourite.businesses;

        // Check for mismatches in counts
        if (
          siteIds.length !== favoriteSites.value.length ||
          businessIds.length !== favoriteBusinesses.value.length
        ) {
          return false;
        }

        // Check if all sites are in sync
        const sitesInSync = favoriteSites.value.every(site => siteIds.has(site.siteId));

        // Check if all businesses are in sync
        const businessesInSync = favoriteBusinesses.value.every(business =>
          businessIds.has(business.businessId)
        );

        lastSyncCheckedAt.value = new Date();

        // Return true only if both are in sync
        return sitesInSync && businessesInSync;
      } catch (error) {
        throw error;
      }
    }

    // async function isBusinessInSync(): Promise<boolean> {
    //   try {
    //     const businesses = await fetchData(
    //       `${ENTITY_URL.FAVOURITE_BUSINESS}/ByMemberId/${userStore.userId}`
    //     );

    //     serverBusinesses.value = businesses.map((s: any) => s.businessData);

    //     if (serverBusinesses.value.length !== favoriteBusinesses.value.length) {
    //       return false;
    //     }

    //     const serverIds = new Set(serverBusinesses.value.map(business => business.businessId));
    //     lastSyncCheckedAt.value = new Date();
    //     return favoriteBusinesses.value.every(business => serverIds.has(business.businessId));
    //   } catch (error) {
    //     throw error;
    //   }
    // }

    function isSiteFavorite(site: SiteView): boolean {
      return favoriteSites.value.some(fav => fav.siteId === site.siteId);
    }

    // async function isSiteInSync(): Promise<boolean> {
    //   try {
    //     const sites = await fetchData(
    //       `${ENTITY_URL.FAVOURITE_SITE}/ByMemberId/${userStore.userId}`
    //     );

    //     serverSites.value = sites.map((s: any) => s.siteData);

    //     if (serverSites.value.length !== favoriteSites.value.length) {
    //       return false;
    //     }

    //     const serverIds = new Set(serverSites.value.map(site => site.siteId));
    //     lastSyncCheckedAt.value = new Date();
    //     return favoriteSites.value.every(site => serverIds.has(site.siteId));
    //   } catch (error) {
    //     throw error;
    //   }
    // }

    function getServerSites() {
      return serverSites.value;
    }

    async function removeBusinessFavorite(business: BusinessView) {
      favoriteBusinesses.value = favoriteBusinesses.value.filter(
        fav => fav.businessId !== business.businessId
      );
      await deleteFavorite(`${ENTITY_URL.FAVOURITE_BUSINESS}/ByBusinessId/${business.businessId}`);
    }

    async function removeSiteFavorite(site: SiteView) {
      favoriteSites.value = favoriteSites.value.filter(fav => fav.siteId !== site.siteId);
      await deleteFavorite(`${ENTITY_URL.FAVOURITE_SITE}/BySiteId/${site.siteId}`);
    }

    async function syncLocalFromRemote(): Promise<void> {
      try {
        const sites = await fetchData(
          `${ENTITY_URL.FAVOURITE_SITE}/ByMemberId/${userStore.userId}`
        );

        // Temporary mapping to address Suleman's api error
        favoriteSites.value = sites.map((s: any) => s.siteData);

        const businesses = await fetchData(
          `${ENTITY_URL.FAVOURITE_BUSINESS}/ByMemberId/${userStore.userId}`
        );

        // Temporary mapping to address Suleman's api error
        favoriteBusinesses.value = businesses.map((s: any) => s.businessData);
      } catch (error) {
        throw error;
      }
    }

    async function syncRemoteFromLocal(): Promise<void> {
      try {
        // Construct the payload
        const payload = {
          sites: favoriteSites.value.map(s => s.siteId),
          businesses: favoriteBusinesses.value.map(b => b.businessId)
        };

        // Check if the user is logged in
        if (!userStore.isUserLogon()) {
          console.warn("User is not logged in. Cannot sync remote data.");
          return;
        }

        // API call to update favorites
        const url = `${ENTITY_URL.FAVOURITE_UPDATE}/${userStore.userId}`;
        await api.update(url, payload);
      } catch (error) {
        console.error("Error syncing remote data:", error);
        throw error;
      }
    }

    function toggleBusinessFavorite(business: BusinessView, isFavorite: boolean) {
      return isFavorite ? removeBusinessFavorite(business) : addBusinessFavorite(business);
    }

    function toggleSiteFavorite(site: SiteView, isFavorite: boolean) {
      return isFavorite ? removeSiteFavorite(site) : addSiteFavorite(site);
    }

    return {
      favoriteBusinesses,
      favoriteSites,
      lastSyncCheckedAt,
      getServerSites,
      isBusinessFavorite,
      // isBusinessInSync,
      isFavoritesInSync,
      isSiteFavorite,
      // isSiteInSync,
      syncLocalFromRemote,
      syncRemoteFromLocal,
      toggleBusinessFavorite,
      toggleSiteFavorite
    };
  },
  {
    persist: true
  }
);
