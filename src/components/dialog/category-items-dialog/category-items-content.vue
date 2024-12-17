<!-- category-items-content.vue -->
<template>
  <!-- Check if categoryItems is empty -->

  <div
    v-if="directory.groupId !== 5 && categoryItems.length === 0"
    class="text-h6 text-center q-pa-md text-grey-6 text-weight-bold"
  >
    {{ $t("errors.noRecord") }}
  </div>

  <q-card bordered flat v-if="directory.groupId === 5" class="q-ma-md">
    <q-responsive :ratio="16 / 9">
      <q-card-section>Mui Wo ↔ Tung Chung</q-card-section>
    </q-responsive>
  </q-card>

  <expansion-description-section v-if="directory.groupId === 5" :directory />

  <template v-if="groupBykey">
    <app-tab-select
      :tab-items="tabItems"
      :current-tab="tab"
      @update:currentTab="setTab"
      :style="$q.screen.lt.sm ? 'flex-wrap: wrap' : ''"
      :class="$q.screen.lt.sm ? 'q-pt-sm' : ''"
    />

    <q-tab-panels v-model="tab">
      <q-tab-panel
        v-for="(item, index) in tabItems"
        :key="index"
        :name="item.name"
        class="q-pa-none"
      >
        <app-category-list-items
          :categoryItems="filterGroupedArray(item.name)"
          :checkIns
          :directory
          :entityKey
          @on-category-detail="onCategoryDetail"
        />
      </q-tab-panel>
    </q-tab-panels>
  </template>

  <app-category-list-items
    v-else
    :categoryItems
    :checkIns
    :directory
    :entityKey
    @on-category-detail="onCategoryDetail"
  />
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { Directory } from "@/interfaces/models/entities/directory";
  import type { TabItem } from "@/interfaces/tab-item";

  import expansionDescriptionSection from "./expansion-description-section.vue";

  // Constants
  import { AREA_NAME, ENTITY_URL, EntityURLKey, NONE } from "@/constants";

  // Props
  const {
    directory,
    entityKey,
    dialogName = "ItemListDialog"
  } = defineProps<{
    directory: Directory;
    entityKey: EntityURLKey;
    dialogName: string;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const { fetchData } = useApi();

  const { groupBy, translate, eventBus } = useUtilities(locale.value);
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  // Reactive variables
  const categoryItems: Ref<CategoryTypes[]> = ref([]);
  const checkIns: Ref<CheckIn[]> = ref([]);

  const directoryId = computed<number>(() =>
    ["BUSINESS", "SITE"].includes(entityKey) ? directory.directoryId : 0
  );

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
      .map(group => ({
        name: group.group,
        label: group.group
      })) as TabItem[];
  });

  const tab = ref("");
  const setTab = (val: string) => (tab.value = val);

  // Function to filter groupedArray by group name
  function filterGroupedArray(groupName: string) {
    const items = groupedArray.value.find(group => group.group === groupName)?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  async function onCategoryDetail(item: any) {
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryDetailDialog(item, dialogName, entityKey, directory.displayMask);
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

            // Sort alphabetically by title, handle missing or undefined titles
            const titleA = a.title || ""; // Default to an empty string if title is undefined
            const titleB = b.title || ""; // Default to an empty string if title is undefined
            return titleA.localeCompare(titleB);
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

  // Lifecycle hooks
  onBeforeMount(() => {
    eventBus("refreshData").on(async () => {
      const lastSelectedTab = tab.value;
      await fetchAllData();
      if (lastSelectedTab) {
        tab.value = lastSelectedTab;
      }
    });
  });

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
