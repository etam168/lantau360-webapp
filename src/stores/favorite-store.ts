import type { SiteView } from "@/interfaces/models/views/site-view";
import type { BusinessView } from "@/interfaces/models/views/business-view";

import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { ENTITY_URL, STORAGE_KEYS } from "@/constants";
import { useUserStore } from "@/stores/user";

const { api } = useApi();
const userStore = useUserStore();

export const useFavoriteStore = defineStore("favorite", () => {
  // State
  const favoriteSites = ref<SiteView[]>(
    (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[]
  );
  const favoriteBusinesses = ref<BusinessView[]>(
    (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[]
  );

  // Helper to sync local storage
  function syncLocalStorage(type: "SITE" | "BUSINESS") {
    if (type === "SITE") {
      LocalStorage.set(STORAGE_KEYS.SAVED.SITE, favoriteSites.value);
    } else if (type === "BUSINESS") {
      LocalStorage.set(STORAGE_KEYS.SAVED.BUSINESS, favoriteBusinesses.value);
    }
  }

  // Actions
  async function addFavorite(item: SiteView | BusinessView, type: "SITE" | "BUSINESS") {
    if (type === "SITE") {
      if (!favoriteSites.value.some(fav => fav.siteId === (item as SiteView).siteId)) {
        favoriteSites.value.push(item as SiteView);
        syncLocalStorage("SITE");

        try {
          // Make API call to save favorite site in the database
          const payload = {
            createdBy: userStore.userId, // Replace with actual user ID if available
            modifiedBy: userStore.userId,
            siteId: (item as SiteView).siteId,
            siteData: { data: item } // Add metadata if required
          };
          await api.create(
            `${ENTITY_URL.FAVOURITE_SITE_UPSERT}/${(item as SiteView).siteId}`,
            payload
          ); // Adjust the endpoint URL if needed
          console.log("Favorite site saved to the database.");
        } catch (error) {
          console.error("Failed to save favorite site to the database:", error);
        }
      }
    } else if (type === "BUSINESS") {
      if (
        !favoriteBusinesses.value.some(fav => fav.businessId === (item as BusinessView).businessId)
      ) {
        favoriteBusinesses.value.push(item as BusinessView);
        syncLocalStorage("BUSINESS");

        try {
          // Make API call to save favorite business in the database
          const payload = {
            createdBy: userStore.userId, // Replace with actual user ID if available
            modifiedBy: userStore.userId,
            businessId: (item as BusinessView).businessId,
            businessData: { data: item } // Add metadata if required
          };

          await api.create(
            `${ENTITY_URL.FAVOURITE_BUSINESS_UPSERT}/${(item as BusinessView).businessId}`,
            payload
          ); // Adjust the endpoint URL if needed
          console.log("Favorite business saved to the database.");
        } catch (error) {
          console.error("Failed to save favorite business to the database:", error);
        }
      }
    }
  }

  function isFavoriteBusiness(item: BusinessView): boolean {
    return favoriteBusinesses.value.some(fav => fav.businessId === item.businessId);
  }

  function isFavoriteSite(item: SiteView): boolean {
    return favoriteSites.value.some(fav => fav.siteId === item.siteId);
  }

  async function removeFavorite(item: SiteView | BusinessView, type: "SITE" | "BUSINESS") {
    if (type === "SITE") {
      favoriteSites.value = favoriteSites.value.filter(
        fav => fav.siteId !== (item as SiteView).siteId
      );
      syncLocalStorage("SITE");

      try {
        // Make API call to remove favorite site
        await api.delete(`${ENTITY_URL.FAVOURITE_SITE}/BySiteId/${(item as SiteView).siteId}`);
        console.log("Favorite site removed from the database.");
      } catch (error) {
        console.error("Failed to remove favorite site from the database:", error);
      }
    } else if (type === "BUSINESS") {
      favoriteBusinesses.value = favoriteBusinesses.value.filter(
        fav => fav.businessId !== (item as BusinessView).businessId
      );
      syncLocalStorage("BUSINESS");

      try {
        // Make API call to remove favorite business
        await api.delete(
          `${ENTITY_URL.FAVOURITE_BUSINESS}/ByBusinessId/${(item as BusinessView).businessId}`
        );
        console.log("Favorite business removed from the database.");
      } catch (error) {
        console.error("Failed to remove favorite business from the database:", error);
      }
    }
  }

  async function removeBusinessFavorite(item: BusinessView) {
    favoriteBusinesses.value = favoriteBusinesses.value.filter(
      fav => fav.businessId !== (item as BusinessView).businessId
    );
    syncLocalStorage("BUSINESS");

    try {
      console.log("Favorite business removed from the database.");
    } catch (error) {
      console.error("Failed to remove favorite business from the database:", error);
    }
  }

  async function removeSiteFavorite(item: SiteView) {
    favoriteSites.value = favoriteSites.value.filter(
      fav => fav.siteId !== (item as SiteView).siteId
    );
    syncLocalStorage("SITE");

    try {
      // Make API call to remove favorite site
      //await api.delete(`${ENTITY_URL.FAVOURITE_SITE}/BySiteId/${(item as SiteView).siteId}`);
      console.log("Favorite site removed from the database.");
    } catch (error) {
      console.error("Failed to remove favorite site from the database:", error);
    }
  }

  async function addSiteFavorite(item: SiteView) {
    if (!favoriteSites.value.some(fav => fav.siteId === (item as SiteView).siteId)) {
      favoriteSites.value.push(item as SiteView);
      syncLocalStorage("SITE");

      try {
        // Make API call to save favorite site in the database
        const payload = {
          createdBy: userStore.userId, // Replace with actual user ID if available
          modifiedBy: userStore.userId,
          siteId: (item as SiteView).siteId,
          siteData: { data: item } // Add metadata if required
        };
        // await api.create(
        //   `${ENTITY_URL.FAVOURITE_SITE_UPSERT}/${(item as SiteView).siteId}`,
        //   payload
        // ); // Adjust the endpoint URL if needed
        console.log("Favorite site saved to the database.");
      } catch (error) {
        console.error("Failed to save favorite site to the database:", error);
      }
    }
  }

  async function addBusinessFavorite(item: BusinessView) {
    if (
      !favoriteBusinesses.value.some(fav => fav.businessId === (item as BusinessView).businessId)
    ) {
      favoriteBusinesses.value.push(item as BusinessView);
      syncLocalStorage("BUSINESS");

      try {
        // Make API call to save favorite site in the database
        const payload = {
          createdBy: userStore.userId, // Replace with actual user ID if available
          modifiedBy: userStore.userId,
          businessId: (item as BusinessView).businessId,
          businessData: { data: item } // Add metadata if required
        };
        // await api.create(
        //   `${ENTITY_URL.FAVOURITE_SITE_UPSERT}/${(item as SiteView).siteId}`,
        //   payload
        // ); // Adjust the endpoint URL if needed
        console.log("Favorite business saved to the database.");
      } catch (error) {
        console.error("Failed to save favorite site to the database:", error);
      }
    }
  }

  function toggleSiteFavorite(item: SiteView, favStatus: boolean) {
    if (favStatus) {
      removeSiteFavorite(item);
    } else {
      addSiteFavorite(item);
    }
  }

  function toggleBusinessFavorite(item: BusinessView, favStatus: boolean) {
    if (favStatus) {
      removeBusinessFavorite(item);
    } else {
      addBusinessFavorite(item);
    }
  }

  return {
    favoriteSites,
    favoriteBusinesses,
    addFavorite,
    isFavoriteBusiness,
    isFavoriteSite,
    removeFavorite,
    toggleBusinessFavorite,
    toggleSiteFavorite
  };
});
