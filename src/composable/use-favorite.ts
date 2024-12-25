import type { BusinessView } from "@/interfaces/models/views/business-view";
import type { SiteView } from "@/interfaces/models/views/site-view";
import { useFavoriteStore } from "@/stores/favorite-store";

export function useFavorite(entityKey: "SITE" | "BUSINESS") {
  const favoriteStore = useFavoriteStore();

  function isFavouriteItem(item: SiteView | BusinessView): boolean {
    return favoriteStore.isFavorite(item, entityKey);
  }

  function toggleItemFavStatus(item: SiteView | BusinessView, favStatus: boolean) {
    if (favStatus) {
      favoriteStore.removeFavorite(item, entityKey);
    } else {
      favoriteStore.addFavorite(item, entityKey);
    }
  }

  return {
    isFavouriteItem,
    toggleItemFavStatus,
  };
}
