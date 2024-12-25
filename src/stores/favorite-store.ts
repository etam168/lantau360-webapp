import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { STORAGE_KEYS } from "@/constants";
import type { SiteView } from "@/interfaces/models/views/site-view";
import type { BusinessView } from "@/interfaces/models/views/business-view";

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
  function addFavorite(item: SiteView | BusinessView, type: "SITE" | "BUSINESS") {
    if (type === "SITE") {
      if (!favoriteSites.value.some(fav => fav.siteId === (item as SiteView).siteId)) {
        favoriteSites.value.push(item as SiteView);
        syncLocalStorage("SITE");
      }
    } else if (type === "BUSINESS") {
      if (!favoriteBusinesses.value.some(fav => fav.businessId === (item as BusinessView).businessId)) {
        favoriteBusinesses.value.push(item as BusinessView);
        syncLocalStorage("BUSINESS");
      }
    }
  }

  function removeFavorite(item: SiteView | BusinessView, type: "SITE" | "BUSINESS") {
    if (type === "SITE") {
      favoriteSites.value = favoriteSites.value.filter(
        fav => fav.siteId !== (item as SiteView).siteId
      );
      syncLocalStorage("SITE");
    } else if (type === "BUSINESS") {
      favoriteBusinesses.value = favoriteBusinesses.value.filter(
        fav => fav.businessId !== (item as BusinessView).businessId
      );
      syncLocalStorage("BUSINESS");
    }
  }

  function isFavorite(item: SiteView | BusinessView, type: "SITE" | "BUSINESS"): boolean {
    if (type === "SITE") {
      return favoriteSites.value.some(fav => fav.siteId === (item as SiteView).siteId);
    } else if (type === "BUSINESS") {
      return favoriteBusinesses.value.some(fav => fav.businessId === (item as BusinessView).businessId);
    }
    return false;
  }

  return {
    favoriteSites,
    favoriteBusinesses,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
});
