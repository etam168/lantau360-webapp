// Types
import type { CategoryTypes } from "@/interfaces/types/category-types";

// Constants
import { EntityURLKey, TEMPLATE } from "@/constants";

// Composables
import { useGeolocation } from "@vueuse/core";
import L from "leaflet";

export function useSortCategoryItems(entityKey: EntityURLKey) {
  const { coords } = useGeolocation();
  const { getEntityName } = useUtilities();

  const entityName = getEntityName(entityKey);

  // Function to get numeric distance for sorting
  function getDistanceValue(item: CategoryTypes): number {
    switch (true) {
      case !coords.value?.latitude:
      case !coords.value?.longitude:
      case isNaN(coords.value.latitude):
      case isNaN(coords.value.longitude):
      case !item?.latitude:
      case !item?.longitude:
      case isNaN(item.latitude):
      case isNaN(item.longitude):
        return Infinity;
      case item.directoryTemplate === TEMPLATE.TAXI.value:
      case item.directoryTemplate === TEMPLATE.TIMETABLE.value:
      case item.directoryTemplate === TEMPLATE.EMERGENCY.value:
        return Infinity;

      default:
        const sourcePoint = L.latLng(coords.value.latitude, coords.value.longitude);
        const destinationPoint = L.latLng(item.latitude, item.longitude);
        return sourcePoint.distanceTo(destinationPoint);
    }
  }

  function sortCategoryTypes(categoryItems: any[], sortByKey: string) {
    if (sortByKey === "default") {
      return [...categoryItems].sort((a, b) => {
        if (a.rank !== b.rank) {
          return (a.rank || 0) - (b.rank || 0);
        }

        if (a.directoryTemplate === 2 && b.directoryTemplate === 2) {
          // Use the entity name as the field for sorting
          const entityFieldA = (a as any)[`${entityName}Name`] || "";
          const entityFieldB = (b as any)[`${entityName}Name`] || "";
          return entityFieldA.localeCompare(entityFieldB);
        } else {
          const titleA = a.title || "";
          const titleB = b.title || "";
          return titleA.localeCompare(titleB);
        }
      });
    } else if (sortByKey === "distance") {
      // Only sort by distance if we have valid coordinates
      if (!coords.value?.latitude || !coords.value?.longitude) {
        return categoryItems;
      }

      const itemsWithDistance = categoryItems.map(item => ({
        item,
        distance: getDistanceValue(item)
      }));

      return itemsWithDistance.sort((a, b) => a.distance - b.distance).map(({ item }) => item);
    }

    return categoryItems;
  }

  return {
    getDistanceValue,
    sortCategoryTypes
  };
}
