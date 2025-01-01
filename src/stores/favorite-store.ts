import type { SiteView } from "@/interfaces/models/views/site-view";
import type { BusinessView } from "@/interfaces/models/views/business-view";

import { defineStore } from "pinia";
import { ENTITY_URL } from "@/constants";
import { useUserStore } from "@/stores/user";

const { api } = useApi();
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
    await api.delete(deleteUrl);
  } catch (error) {
    throw error;
  }
}

export const useFavoriteStore = defineStore(
  "favorite",
  () => {
    const favoriteSites = ref<SiteView[]>([]);
    const favoriteBusinesses = ref<BusinessView[]>([]);
    const lastSyncCheckedAt = ref<Date>(new Date());
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

    async function removeSiteFavorite(site: SiteView) {
      favoriteSites.value = favoriteSites.value.filter(fav => fav.siteId !== site.siteId);
      await deleteFavorite(`${ENTITY_URL.FAVOURITE_SITE}/BySiteId/${site.siteId}`);
    }

    function isSiteFavorite(site: SiteView): boolean {
      return favoriteSites.value.some(fav => fav.siteId === site.siteId);
    }

    function toggleSiteFavorite(site: SiteView, isFavorite: boolean) {
      if (isFavorite) {
        return removeSiteFavorite(site);
      }
      return addSiteFavorite(site);
    }

    async function removeBusinessFavorite(business: BusinessView) {
      favoriteBusinesses.value = favoriteBusinesses.value.filter(
        fav => fav.businessId !== business.businessId
      );
      await deleteFavorite(`${ENTITY_URL.FAVOURITE_BUSINESS}/ByBusinessId/${business.businessId}`);
    }

    function isBusinessFavorite(business: BusinessView): boolean {
      return favoriteBusinesses.value.some(fav => fav.businessId === business.businessId);
    }

    function toggleBusinessFavorite(business: BusinessView, isFavorite: boolean) {
      if (isFavorite) {
        return removeBusinessFavorite(business);
      }
      return addBusinessFavorite(business);
    }

    async function isBusinessInSync(): Promise<boolean> {
      try {
        const response = await api.get(`${ENTITY_URL.FAVOURITE_BUSINESS}/ByMemberId/${userStore.userId}`);
        const serverFavorites: BusinessView[] = response.data;

        if (serverFavorites.length !== favoriteBusinesses.value.length) {
          return false;
        }

        const serverIds = new Set(serverFavorites.map(business => business.businessId));
        lastSyncCheckedAt.value = new Date();
        return favoriteBusinesses.value.every(business => serverIds.has(business.businessId));
      } catch (error) {
        throw error;
      }
      
    }

    async function isSiteInSync(): Promise<boolean> {
      try {
        const response = await api.get(`${ENTITY_URL.FAVOURITE_SITE}/ByMemberId/${userStore.userId}`);
        const serverFavorites: SiteView[] = response.data;

        if (serverFavorites.length !== favoriteSites.value.length) {
          return false;
        }

        const serverIds = new Set(serverFavorites.map(site => site.siteId));
        lastSyncCheckedAt.value = new Date();
        return favoriteSites.value.every(site => serverIds.has(site.siteId));
      } catch (error) {
        throw error;
      }
      
    }

    return {
      favoriteBusinesses,
      favoriteSites,
      lastSyncCheckedAt,
      addBusinessFavorite,
      addSiteFavorite,
      isBusinessFavorite,
      isSiteFavorite,
      isBusinessInSync,
      isSiteInSync,
      removeBusinessFavorite,
      removeSiteFavorite,
      toggleBusinessFavorite,
      toggleSiteFavorite
    };
  },
  {
    persist: true
  }
);
