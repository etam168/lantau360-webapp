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
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td style="padding: 0">
          <app-category-item
            :category-item="props.row"
            :distance="getDistanceValue(props.row)"
            :directory
            :entityKey
            @click="handleDetail(props.row)"
          />
        </q-td>
      </q-tr>
    </template>

    <template v-slot:no-data>
      <app-no-record-message v-if="rows.length <= 1" :message="$t('errors.noRecord')" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Types
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";

  // Composables
  import { useGeolocation } from "@vueuse/core";
  import L from "leaflet";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Emits
  const emits = defineEmits(["on-category-detail"]);

  // Props
  const {
    categoryItems,
    entityKey,
    directory,
    sortByKey = "default"
  } = defineProps<{
    categoryItems: CategoryTypes[];
    entityKey: EntityURLKey;
    directory?: DirectoryTypes;
    sortByKey?: string;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const { getEntityName } = useUtilities(locale.value);

  const entityName = getEntityName(entityKey);

  const cardStyle = computed(() => ({
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  }));

  const { coords } = useGeolocation();

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
      default:
        const sourcePoint = L.latLng(coords.value.latitude, coords.value.longitude);
        const destinationPoint = L.latLng(item.latitude, item.longitude);
        return sourcePoint.distanceTo(destinationPoint);
    }
  }

  // Compute rows for the table
  const rows = computed(() => {
    // Check if sortByKey is 'default'
    if (sortByKey === "default") {
      // Sort categoryItems by rank first, then alphabetically by title or siteName for directoryTemplate === 2
      return [...categoryItems].sort((a: any, b: any) => {
        // Sort by rank first
        if (a.rank !== b.rank) {
          return (a.rank || 0) - (b.rank || 0); // Default rank to 0 if undefined
        }

        // If ranks are equal, sort by siteName for directoryTemplate === 2, otherwise by title
        if (a.directoryTemplate === 2 && b.directoryTemplate === 2) {
          const siteNameA = a.siteName || "";
          const siteNameB = b.siteName || "";
          return siteNameA.localeCompare(siteNameB);
        } else {
          // If directoryTemplate is not 2 for both or either, sort alphabetically by title
          const titleA = a.title || "";
          const titleB = b.title || "";
          return titleA.localeCompare(titleB);
        }
      });
    } else if (sortByKey === "distance") {
      return [...categoryItems].sort((a, b) => {
        const distanceA = getDistanceValue(a);
        const distanceB = getDistanceValue(b);
        return distanceA - distanceB;
      });
    }

    // If no valid sortByKey is given, return the original list
    return categoryItems;
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
