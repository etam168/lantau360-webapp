// interface files
import type { BusinessView } from "@/interfaces/models/views/business-view";
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { SiteView } from "@/interfaces/models/views/site-view";

// .ts file
import { EntityURLKey, STORAGE_KEYS } from "@/constants";
import { LocalStorage } from "quasar";

export function useFavorite(entityKey: EntityURLKey) {
  function isFavouriteItem(item: CategoryTypes): boolean {
    if (entityKey == "SITE") {
      const favItems = (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[];
      return useArraySome(favItems, fav => fav.siteId == (item as SiteView).siteId).value;
    } else if (entityKey == "BUSINESS") {
      const favItems = (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[];
      return useArraySome(favItems, fav => fav.businessId == (item as BusinessView).businessId).value;
    }
    return false;
  }

  function toggleItemFavStatus(item: CategoryTypes, favStatus: boolean) {
    const isBusiness = entityKey == "BUSINESS";
    const id = entityKey == "BUSINESS" ? (item as BusinessView).businessId : (item as SiteView).siteId;
    const storageKey = isBusiness ? STORAGE_KEYS.SAVED.BUSINESS : STORAGE_KEYS.SAVED.SITE;

    const favItems = (LocalStorage.getItem(storageKey) || []) as (BusinessView | SiteView)[];
    const index = favItems.findIndex(
      fav => (isBusiness ? (fav as BusinessView).businessId : (fav as SiteView).siteId) === id
    );

    if (favStatus && index !== -1) {
      favItems.splice(index, 1);
    } else if (!favStatus) {
      favItems.push(item as BusinessView | SiteView);
    }

    LocalStorage.set(storageKey, favItems);
  }

  return {
    isFavouriteItem,
    toggleItemFavStatus
  };
}
