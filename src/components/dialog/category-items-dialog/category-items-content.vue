<!-- category-items-content.vue -->
<template>
  <!-- Check if categoryItems is empty -->
  <div
    v-if="categoryItems.length === 0"
    class="text-h6 text-center q-pa-md text-grey-6 text-weight-bold"
  >
    {{ $t("errors.noRecord") }}
  </div>
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
          :entityKey
          @on-category-detail="handleDetail"
        />
      </q-tab-panel>
    </q-tab-panels>
  </template>

  <app-category-list-items
    v-else
    :categoryItems
    :checkIns
    :entityKey
    @on-category-detail="handleDetail"
  />
</template>

<script setup lang="ts">
  // Interface
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { Directory } from "@/interfaces/models/entities/directory";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import { AREA_NAME, ENTITY_URL, EntityURLKey, NONE } from "@/constants";

  // Props
  const {
    directory,
    entityKey,
    dialogName = "ItemListDialog"
  } = defineProps<{
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    dialogName: string;
  }>();

  const { groupBy, translate, eventBus } = useUtilities();
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const $q = useQuasar();

  const categoryItems: Ref<CategoryTypes[]> = ref([]);
  const checkIns: Ref<CheckIn[]> = ref([]);

  const directoryId: ComputedRef<number> = computed(() => {
    switch (entityKey) {
      case "BUSINESS":
      case "SITE":
        return (directory as Directory).directoryId;
      default:
        return 0;
    }
  });

  const groupBykey: ComputedRef<string | null> = computed(() => {
    switch (true) {
      case directory.meta?.groupByKey !== NONE:
        return directory.meta?.groupByKey ?? null;
      default:
        return null;
    }
  });

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
    return groupedArray.value.map(group => ({
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

  async function handleDetail(item: any) {
    eventBus("DialogStatus").emit(true, dialogName + "Detail");
    openCategoryDetailDialog(item, dialogName + "Detail");
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
