<template>
  <q-table v-bind="$attrs" flat hide-header hide-pagination :rows="rows" :row-key="rowKey">
    <template v-slot:top>
      <q-card
        v-if="directory.groupId === SIGHTSEEING_GROUP"
        flat
        bordered
        class="q-ma-md full-height"
      >
        <q-responsive :ratio="16 / 9">
          <q-card-section>{{
            translate(directory.shortName, directory.meta, "shortName")
          }}</q-card-section>
        </q-responsive>
      </q-card>

      <app-tab-select
        v-if="hasGroup"
        :tab-items="tabItems"
        :current-tab="tab"
        @update:currentTab="setTab"
        :class="$q.screen.lt.sm ? 'justify-center' : ''"
      />

      <app-taxi-fleet-banner v-if="directoryTemplate === 2" />
    </template>

    <template v-slot:body="{ row }">
      <app-category-item
        :categoryItem="row"
        :distance="getDistanceValue(row)"
        :directory
        :entityKey
        @on-directory-item="onCategoryDetail(row)"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Types
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";

  // Constants
  import { AREA_NAME, NONE, type EntityURLKey } from "@/constants";
  import { TabItem } from "@/interfaces/tab-item";

  // Composables
  import { EventBus } from "quasar";
  import { useGeolocation } from "@vueuse/core";
  import L from "leaflet";

  // Props
  const { categoryItems, directory, entityKey, style } = defineProps<{
    categoryItems: CategoryTypes[];
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    style?: any;
  }>();

  const { t, locale } = useI18n({ useScope: "global" });
  const { groupBy, translate } = useUtilities(locale.value);
  const $q = useQuasar();
  const bus = inject("bus") as EventBus;
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const SIGHTSEEING_GROUP = 5 as const;

  const tab = ref(); //set to first tab
  // const titleClass = computed(() => (isSmallScreen.value ? "text-center" : undefined));
  const directoryTemplate = computed<number>(() => directory.meta.template ?? 0);

  const hasGroup = computed(() => {
    return groupBykey.value !== null;
  });

  const groupBykey = computed<string | null>(() =>
    directory.meta?.groupByKey === NONE ? null : (directory.meta?.groupByKey ?? null)
  );

  const groupedArray = computed(() => {
    if (groupBykey.value == null) {
      return [];
    }

    const key = groupBykey.value;
    const getTranslatedKey = (item: CategoryTypes): string | number => {
      if (!(key in item)) {
        return "Invalid!";
      }

      const itemValue = item[key as keyof CategoryTypes] as string;
      const metaData = key === AREA_NAME ? (item as any).areaNameAlt : item.meta;
      return translate(itemValue, metaData, key);
    };

    const validItems = categoryItems.filter(
      (item: CategoryTypes) => key in item && item[key as keyof CategoryTypes] !== undefined
    );

    return groupBy(validItems, getTranslatedKey);
  });

  const tabItems = computed(() => {
    return groupedArray.value
      .filter(group => typeof group.group === "string" && group.group.trim() !== "")
      .map(group => ({ name: group.group, label: group.group })) as TabItem[];
  });

  function hasTaxiFleet(items: CategoryTypes[]): boolean {
    return items.some(i => i.subtitle3 === "Taxi Fleet");
  }

  function filterGroupedArray(groupName: string) {
    const items = groupedArray.value.find(group => group.group === groupName)?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  const rows = computed(() => {
    switch (true) {
      case hasGroup.value:
        return filterGroupedArray(tab.value);
      default:
        return categoryItems;
    }
  });

  const rowKey = computed(() => {
    switch (tab.value) {
      case "location":
        return "siteId";
      case "business":
        return "businessId";
      case "checkIn":
        return "siteId";
      default:
        return "";
    }
  });

  const itemClass = computed(() => {
    return tab.value === "checkIn" ? "col-12" : "col-xs-12 col-sm-6 col-md-4 q-pa-xs";
  });

  const setTab = (val: string) => (tab.value = val);

  const cardStyle = computed(() => ({
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  }));

  function onCategoryDetail(item: any) {
    // bus.emit("on-category-detail", item);
    openCategoryDetailDialog(item, entityKey, directory.displayMask);
  }

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

  // Set initial tab value
  watchEffect(() => {
    if (categoryItems.length > 0 && groupBykey.value) {
      tab.value = tabItems.value.length > 0 ? tabItems.value[0].name : "";
    }
  });
</script>

<style lang="scss">
  .q-table__top {
    padding: 0 !important;
  }
</style>
