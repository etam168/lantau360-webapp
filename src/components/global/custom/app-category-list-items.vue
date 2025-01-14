<template>
  <q-table
    v-bind="$attrs"
    flat
    square
    hide-pagination
    hide-header
    :hide-bottom="categoryItems.length > 0"
    :row-key="`${entityName}Id`"
    :card-style="cardStyle"
    :rows="categoryItems"
    :rows-per-page-options="[0]"
  >
    <!-- :style="tableStyle" -->
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td style="padding: 0">
          <app-category-item
            :image-path="props.row.iconPath"
            :line1="line1(props.row)"
            :line2="line2(props.row)"
            :is-checked-in="isCheckedIn(props.row)"
            :is-favorite="isFavoriteItem(props.row)"
            :distance="getDistance(props.row)"
            :pageName
            @click="handleDetail(props.row)"
          />
        </q-td>
      </q-tr>
    </template>

    <template v-slot:no-data>
      <app-no-record-message v-if="categoryItems.length <= 0" :message="$t('errors.noRecord')" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  import { useGeolocation } from "@vueuse/core";
  import L from "leaflet";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Store
  import { useCheckInStore } from "@/stores/checkin-store";
  import { useFavoriteStore } from "@/stores/favorite-store";

  // Emits
  const emits = defineEmits(["on-category-detail"]);

  // Props
  const { categoryItems, entityKey, directory } = defineProps<{
    categoryItems: CategoryTypes[];
    entityKey: EntityURLKey;
    directory?: DirectoryTypes;
    pageName?: string;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const { getEntityName, translate } = useUtilities(locale.value);

  const entityName = getEntityName(entityKey);
  const checkInStore = useCheckInStore();
  const favoriteStore = useFavoriteStore();

  const cardStyle = computed(() => ({
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  }));

  const isCheckedIn = (item: CategoryTypes): boolean => {
    switch (entityKey) {
      case "SITE":
        return checkInStore.isCheckIn(item as SiteView);
      default:
        return false;
    }
  };

  const isFavoriteItem = (item: CategoryTypes): boolean => {
    switch (entityKey) {
      case "BUSINESS":
        return favoriteStore.isBusinessFavorite(item as BusinessView);
      case "SITE":
        return favoriteStore.isSiteFavorite(item as SiteView);
      default:
        return false;
    }
  };

  function line1(item: CategoryTypes): string {
    if (directory && directory.groupId === 5) {
      return "";
    }
    const name = `${entityName}Name` as keyof CategoryTypes;
    return translate(item[name] as string, item.meta, name);
  }

  function line2(item: CategoryTypes): string {
    if (directory && directory.groupId === 5) {
      return title(item);
    }
    if (directory?.meta.template === 3) {
      return title(item);
    }
    return translate(item.subtitle1, item.meta, "subtitle1");
  }

  function title(item: CategoryTypes) {
    return translate(item.title, item.meta, "title");
  }

  const { coords: userLocation } = useGeolocation();

  function getDistance(item: any): string | undefined {
  if (!userLocation.value.latitude || !userLocation.value.longitude) {
    return undefined; // Return undefined if user location is unavailable
  }

  if (!item.latitude || !item.longitude) {
    return undefined; // Return undefined if item location is unavailable
  }

  const sourcePoint = L.latLng(userLocation.value.latitude, userLocation.value.longitude);
  const destinationPoint = L.latLng(item.latitude, item.longitude);

  const distanceInMeters = sourcePoint.distanceTo(destinationPoint);
  return distanceInMeters > 1000
    ? `${(distanceInMeters / 1000).toFixed(1)} km`
    : `${Math.round(distanceInMeters)} meters`;
}


  function handleDetail(item: any) {
    emits("on-category-detail", item);
  }
</script>

<style>
  .q-table__card .q-table__middle {
    flex: inherit;
  }
</style>
