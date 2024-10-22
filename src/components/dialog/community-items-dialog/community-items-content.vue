<!-- community-items-content.vue -->
<template>
  <q-card>
    <q-item clickable v-ripple @click="createPosting">
      <q-item-section avatar>
        <q-avatar color="green-1" text-color="primary" :icon="fasPlus" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{
          $t("action.createDirectory", { directoryName: directory.directoryName })
        }}</q-item-label>
        <q-item-label caption>{{
          $t("community.createPost.addGalleryDescription")
        }}</q-item-label></q-item-section
      >
    </q-item>

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
          <app-community-list-items
            :communityItems="filterGroupedArray(item.name)"
            :entityKey
            @on-category-detail="handleDetail"
          />
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <app-community-list-items
      v-else
      :communityItems
      :entityKey
      @on-category-detail="handleDetail"
    />
  </q-card>
</template>

<script setup lang="ts">
  // Interface
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import { AREA_NAME, EntityURLKey, NONE } from "@/constants";
  import { fasPlus } from "@quasar/extras/fontawesome-v6";

  // Props
  const { directory, entityKey } = defineProps<{
    directory: CommunityDirectory;
    entityKey: EntityURLKey;
  }>();

  const { groupBy, translate } = useUtilities();
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { handleOpenDialog } = useEntityDataHandlingService();

  const $q = useQuasar();
  const isDialogOpen = ref(false);

  const communityItems: Ref<CategoryTypes[]> = ref([]);

  const directoryId: ComputedRef<number> = computed(() => {
    switch (entityKey) {
      case "POSTING":
      case "COMMUNITY_DIRECTORY":
        return (directory as CommunityDirectory).communityDirectoryId;
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

    const validItems = communityItems.value.filter(
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

  function createPosting() {
    // To be implemented
    const entityKey = "POSTING" as EntityURLKey;
    const props = { entityKey: entityKey };
    handleOpenDialog(props, isDialogOpen.value, ["POSTING"], entityKey);
  }

  async function handleDetail(item: any) {
    openCategoryDetailDialog(item);
  }

  /**
   * Fetches all required data concurrently
   * Populates the reactive variables with the fetched data
   */
  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "POSTING":
        case "COMMUNITY_DIRECTORY":
          communityItems.value = await fetchData(`Posting/ByDirectoryId/${directoryId.value}`);
        // alert(JSON.stringify(communityItems.value));
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }

      // Set the initial tab value after data is fetched
      if (communityItems.value.length > 0 && groupBykey.value) {
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
