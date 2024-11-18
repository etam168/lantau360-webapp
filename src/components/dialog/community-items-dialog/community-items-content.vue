<!-- community-items-content.vue -->
<template>
  <q-card>
    <q-item clickable v-ripple @click="onCreatePosting">
      <q-item-section avatar>
        <q-avatar color="green-1" text-color="primary" :icon="fasPlus" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ createTitle }}</q-item-label>
        <q-item-label caption>{{ createDescription }}</q-item-label>
      </q-item-section>
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
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import { AREA_NAME, ENTITY_URL, EntityURLKey, NONE } from "@/constants";
  import { fasPlus } from "@quasar/extras/fontawesome-v6";

  // Props
  const {
    directory,
    entityKey,
    dialogName = "ItemListDialog"
  } = defineProps<{
    directory: CommunityDirectory;
    entityKey: EntityURLKey;
    dialogName: string;
  }>();

  // Composable function calls
  const { eventBus, getEntityName, groupBy, translate } = useUtilities();
  const { fetchData } = useApi();
  const { openCreatePosting, openCommunityDetailDialog } = useCommunityDialogService(entityKey);
  const { t } = useI18n({ useScope: "global" });

  // Reactive variables
  const $q = useQuasar();
  const isDialogOpen = ref(false);

  const communityItems: Ref<CategoryTypes[]> = ref([]);

  const i18nKey = getEntityName(entityKey);
  const createDescription = computed(() => t(`${i18nKey}.mainMenu.addGalleryDescription`));
  const createTitle = computed(() =>
    t(`${i18nKey}.mainMenu.createDirectory`, { directoryName: directory.directoryName })
  );

  const directoryId = computed<number>(() =>
    ["POSTING", "COMMUNITY_DIRECTORY"].includes(entityKey)
      ? (directory as CommunityDirectory).communityDirectoryId
      : 0
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

  function filterGroupedArray(groupName: string) {
    const items = groupedArray.value.find(group => group.group === groupName)?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  async function onCreatePosting() {
    const dialogName = "PostingListDialog";
    eventBus("DialogStatus").emit(true, dialogName);
    openCreatePosting(isDialogOpen, directory);
  }

  async function handleDetail(item: any) {
    eventBus("DialogStatus").emit(true, dialogName + "Detail");
    openCommunityDetailDialog(isDialogOpen, item, dialogName + "Detail");
  }

  /**
   * Fetches all required data concurrently
   * Populates the reactive variables with the fetched data
   */
  async function fetchAllData() {
    try {
      switch (entityKey) {
        case "POSTING":
        case "COMMUNITY_DIRECTORY": {
          communityItems.value = await fetchData(
            `${ENTITY_URL.POSTING_BY_DIRECTORY}/${directoryId.value}`
          );

          // Set the initial tab value
          if (communityItems.value.length > 0 && groupBykey.value) {
            tab.value = tabItems.value.length > 0 ? tabItems.value[0].name : "";
          }
          break;
        }

        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
          break;
      }
    } catch (error) {
      console.error("Error fetching data:", error);

      // Optionally throw the error to handle it upstream
      throw error;
    }
  }

  onBeforeMount(() => {
    eventBus("refreshData").on(async () => {
      await fetchAllData();
    });
  });

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
