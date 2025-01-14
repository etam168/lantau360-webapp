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
    :rows="rows"
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
  import { EntityURLKey, TEMPLATE } from "@/constants";

  // Store
  import { useCheckInStore } from "@/stores/checkin-store";
  import { useFavoriteStore } from "@/stores/favorite-store";

  // Emits
  const emits = defineEmits(["on-category-detail"]);

  // Props
  const {
    categoryItems,
    entityKey,
    directory,
    isSortByDistance = false
  } = defineProps<{
    categoryItems: CategoryTypes[];
    entityKey: EntityURLKey;
    directory?: DirectoryTypes;
    isSortByDistance?: boolean;
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
        const site = item as SiteView;
        return checkInStore.isCheckIn(site) && site.directoryTemplate != TEMPLATE.TAXI.value;
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

  const { coords } = useGeolocation();

  function getDistance(item: any) {
    switch (true) {
      case item.directoryTemplate === TEMPLATE.TAXI.value:
        return "";
      case !coords.value?.latitude ||
        !coords.value?.longitude ||
        isNaN(coords.value.latitude) ||
        isNaN(coords.value.longitude):
        return "N/A";
      case !item?.latitude || !item?.longitude || isNaN(item.latitude) || isNaN(item.longitude):
        return "N/A";
    }

    const sourcePoint = L.latLng(coords.value.latitude, coords.value.longitude);
    const destinationPoint = L.latLng(item.latitude, item.longitude);

    // Calculate distance
    const distanceInMeters = sourcePoint.distanceTo(destinationPoint);

    // Format distance:
    // - If less than 1 meter, return "< 1M"
    // - If less than 1KM, return meters with "M" suffix
    // - If 1KM or more, return kilometers with "KM" suffix
    switch (true) {
      case isNaN(distanceInMeters):
        return "";
      case distanceInMeters < 1:
        return "< 1M";
      case distanceInMeters < 1000:
        return `${Math.round(distanceInMeters)}M`;
      default:
        return `${(distanceInMeters / 1000).toFixed(1)}KM`;
    }
  }

  // Function to get numeric distance for sorting
  function getDistanceValue(item: any): number {
    switch (true) {
      case item.directoryTemplate === TEMPLATE.TAXI.value:
        return Infinity;
      case !coords.value?.latitude ||
        !coords.value?.longitude ||
        isNaN(coords.value.latitude) ||
        isNaN(coords.value.longitude):
        return Infinity;
      case !item?.latitude || !item?.longitude || isNaN(item.latitude) || isNaN(item.longitude):
        return Infinity;
    }

    const sourcePoint = L.latLng(coords.value.latitude, coords.value.longitude);
    const destinationPoint = L.latLng(item.latitude, item.longitude);
    return sourcePoint.distanceTo(destinationPoint);
  }

  // Compute rows for the table
  const rows = computed(() => {
    if (!isSortByDistance) return categoryItems;

    return [...categoryItems].sort((a, b) => {
      const distanceA = getDistanceValue(a);
      const distanceB = getDistanceValue(b);
      return distanceA - distanceB;
    });
  });

  function handleDetail(item: any) {
    emits("on-category-detail", item);
  }
</script>

<style>
  .q-table__card .q-table__middle {
    flex: inherit;
  }
</style>
