<template>
  <template v-if="groupBykey">
    <!-- Tab Select -->
    <app-tab-select
      :tab-items="tabItems"
      :current-tab="tab"
      @update:currentTab="setTab"
      :style="$q.screen.lt.sm ? 'flex-wrap: wrap' : ''"
      :class="$q.screen.lt.sm ? 'q-pt-sm' : ''"
    />

    <q-separator />

    <!-- Tab Panels -->
    <q-tab-panels v-model="tab">
      <q-tab-panel
        v-for="(item, index) in tabItems"
        :key="index"
        :name="item.name"
        class="q-pa-none"
      >
        <app-taxi-fleet-banner
          v-if="directoryTemplate === 2 && hasTaxiFleet(filterGroupedArray(item.name))"
        />

        <app-category-list-items
          :categoryItems="filterGroupedArray(item.name)"
          :directory="directory"
          :entityKey="entityKey"
          :sortByKey="sortByKey"
          :style="tableStyle"
          @on-category-detail="onCategoryDetail"
        />
      </q-tab-panel>
    </q-tab-panels>
  </template>

  <!-- Default List View -->
  <app-category-list-items
    v-else
    :categoryItems="categoryItems"
    :directory="directory"
    :entityKey="entityKey"
    :sortByKey="sortByKey"
    @on-category-detail="onCategoryDetail"
    :style="tableStyle"
  />
</template>

<script setup lang="ts">
  // Types
  import type { TabItem } from "@/interfaces/tab-item";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { EntityURLKey } from "@/constants";

  // Constants
  import { AREA_NAME, NONE } from "@/constants";

  const props = defineProps<{
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    categoryItems: CategoryTypes[];
    sortByKey: string;
  }>();

  const emit = defineEmits<{
    (e: "onCategoryDetail", item: any): void;
  }>();

  const $q = useQuasar();
  const { locale } = useI18n({ useScope: "global" });
  const { groupBy, translate } = useUtilities(locale.value);
  const tab = ref("");
  const setTab = (val: string) => (tab.value = val);

  const directoryTemplate = computed<number>(() => props.directory.meta.template ?? 0);

  const THRESHOLD = 150;

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const tabHeight = props.directory?.meta?.groupByKey !== "none" ? 51 + 51 : 51;
    const bannerHeight = directoryTemplate.value === 2 && groupBykey.value ? 78 : 0;
    const usedHeight = tabHeight + bannerHeight;

    const hasNoData = props.categoryItems.length === 0;
    const hasEnoughSpace = $q.screen.height - usedHeight > THRESHOLD;

    switch (true) {
      case hasNoData:
        return undefined;
      case hasEnoughSpace:
        return { height: `calc(100vh - ${usedHeight}px)` };
      default:
        return undefined;
    }
  });

  function hasTaxiFleet(items: CategoryTypes[]): boolean {
    return items.some(i => i.subtitle3 === "Taxi Fleet");
  }

  const groupBykey = computed<string | null>(() =>
    props.directory.meta?.groupByKey === NONE ? null : (props.directory.meta?.groupByKey ?? null)
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

    const validItems = props.categoryItems.filter(
      (item: CategoryTypes) => key in item && item[key as keyof CategoryTypes] !== undefined
    );

    return groupBy(validItems, getTranslatedKey);
  });

  const tabItems = computed(() => {
    return groupedArray.value
      .filter(group => typeof group.group === "string" && group.group.trim() !== "")
      .map(group => ({ name: group.group, label: group.group })) as TabItem[];
  });

  function filterGroupedArray(groupName: string) {
    const items = groupedArray.value.find(group => group.group === groupName)?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  function onCategoryDetail(item: any) {
    emit("onCategoryDetail", item);
  }

  // Set initial tab value
  watchEffect(() => {
    if (props.categoryItems.length > 0 && groupBykey.value) {
      tab.value = tabItems.value.length > 0 ? tabItems.value[0].name : "";
    }
  });
</script>
