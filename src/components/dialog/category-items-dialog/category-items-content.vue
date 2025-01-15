<!-- category-items-content.vue -->
<template>
  <app-sight-seeing-item
    v-if="directory.groupId === 5"
    :categoryItems
    :directory
    :entityKey
    :sortByKey
    :style="tableStyle"
    @on-category-detail="onCategoryDetail"
  />

  <template v-else>
    <template v-if="directory.groupId !== 5 && groupBykey">
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
            v-if="directory?.meta.template === 2 && hasTaxiFleet(filterGroupedArray(item.name))"
          />

          <app-category-list-items
            :categoryItems="filterGroupedArray(item.name)"
            :directory
            :entityKey
            :sortByKey
            :style="tableStyle"
            @on-category-detail="onCategoryDetail"
          />
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <!-- Default List View -->
    <app-category-list-items
      v-else
      :categoryItems
      :directory
      :entityKey
      :sortByKey
      @on-category-detail="onCategoryDetail"
      :style="tableStyle"
    />
  </template>
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import { AREA_NAME, ENTITY_URL, EntityURLKey, NONE } from "@/constants";

  // Props
  const {
    directory,
    entityKey,
    dialogName = "ItemListDialog",
    sortByKey = "default"
  } = defineProps<{
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    dialogName: string;
    sortByKey?: string;
  }>();

  // Composable function calls
  const $q = useQuasar();
  const { locale } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();

  const { groupBy, translate, eventBus } = useUtilities(locale.value);
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  // Reactive variables
  const categoryItems: Ref<CategoryTypes[]> = ref([]);

  const directoryId = computed<number>(() => {
    switch (entityKey) {
      case "BUSINESS":
        return (directory as BusinessDirectory).businessDirectoryId;
      case "SITE":
        return (directory as SiteDirectory).siteDirectoryId;
      default:
        return 0;
    }
  });

  const THRESHOLD = 150 as const;

  function hasTaxiFleet(item: CategoryTypes[]): boolean {
    return item.some(i => i.subtitle3 === "Taxi Fleet");
  }

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
        return "Invalid!"; // Or any default value you prefer
      }

      const itemValue = item[key as keyof CategoryTypes] as string;
      const metaData = key === AREA_NAME ? (item as any).areaNameAlt : item.meta;
      return translate(itemValue, metaData, key);
    };

    const validItems = categoryItems.value.filter(
      (item: CategoryTypes) => key in item && item[key as keyof CategoryTypes] !== undefined
    );

    return groupBy(validItems, getTranslatedKey);
  });

  // Define tabItems as a computed property
  const tabItems = computed(() => {
    return groupedArray.value
      .filter(group => typeof group.group === "string" && group.group.trim() !== "") // Exclude empty or whitespace-only group
      .map(group => ({ name: group.group, label: group.group })) as TabItem[];
  });

  const tab = ref("");
  const setTab = (val: string) => (tab.value = val);

  const TAB_HEIGHT = computed(() => {
    return directory?.meta?.groupByKey !== "none" ? 51 + 51 : 51;
  });

  const BANNER_HEIGHT = computed(() => {
    return directory?.meta?.template === 2 && groupBykey.value ? 78 : 0;
  });

  const usedHeight = computed(() => {
    return TAB_HEIGHT.value + BANNER_HEIGHT.value;
  });

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const hasNoData = categoryItems.value.length === 0;
    const hasEnoughSpace = $q.screen.height - usedHeight.value > THRESHOLD;

    switch (true) {
      case hasNoData:
        return undefined;
      case hasEnoughSpace:
        return { height: `calc(100vh - ${usedHeight.value}px)` };
      default:
        return undefined;
    }
  });

  // Function to filter groupedArray by group name
  function filterGroupedArray(groupName: string) {
    const items = groupedArray.value.find(group => group.group === groupName)?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  async function onCategoryDetail(item: any) {
    const detailDialogName = dialogName + "Detail";
    eventBus("DialogStatus").emit(true, detailDialogName);
    openCategoryDetailDialog(item, detailDialogName, entityKey, directory.displayMask);
  }

  /**
   * Fetches all required data concurrently
   * Populates the reactive variables with the fetched data
   */
  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "BUSINESS":
        case "SITE":
          categoryItems.value = await fetchData(
            `${ENTITY_URL[entityKey]}/ByDirectoryId/${directoryId.value}`
          );

          // Sort categoryItems.value first by rank, then alphabetically by title
          categoryItems.value.sort((a: any, b: any) => {
            // Sort by rank first
            if (a.rank !== b.rank) {
              return (a.rank || 0) - (b.rank || 0); // Default rank to 0 if undefined
            }

            // If ranks are equal, sort by siteName for directoryTemplate === 2, otherwise by title
            if (a.directoryTemplate === 2 && b.directoryTemplate === 2) {
              const siteNameA = a.siteName || ""; // Default to an empty string if siteName is undefined
              const siteNameB = b.siteName || ""; // Default to an empty string if siteName is undefined
              return siteNameA.localeCompare(siteNameB);
            } else {
              // If directoryTemplate is not 2 for both or either, sort alphabetically by title
              const titleA = a.title || ""; // Default to an empty string if title is undefined
              const titleB = b.title || ""; // Default to an empty string if title is undefined
              return titleA.localeCompare(titleB);
            }
          });

          break;

        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }

      // Set the initial tab value after data is fetched
      if (categoryItems.value.length > 0 && groupBykey.value) {
        tab.value = tabItems.value.length > 0 ? tabItems.value[0].name : "";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
