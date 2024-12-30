<!-- community-items-content.vue -->
<template>
  <!-- Create Post -->
  <app-create-post-item
    :create-title="createTitle"
    :create-description="createDescription"
    @on-create-posting="onCreatePosting"
  />

  <template v-if="groupBykey">
    <!-- Tab Select -->
    <app-tab-select
      :tab-items="tabItems"
      :current-tab="tab"
      @update:currentTab="setTab"
      :style="$q.screen.lt.sm ? 'flex-wrap: wrap' : ''"
      :class="$q.screen.lt.sm ? 'q-pt-sm' : ''"
    />

    <!-- Tab Panels -->
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
          @on-community-detail="handleDetail"
        />
      </q-tab-panel>
    </q-tab-panels>
  </template>

  <app-community-list-items v-else :communityItems :entityKey @on-community-detail="handleDetail" />
</template>

<script setup lang="ts">
  import { fasPlus, fasTriangleExclamation } from "@quasar/extras/fontawesome-v6";
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import { AREA_NAME, ENTITY_URL, EntityURLKey, NONE } from "@/constants";

  // Compontents
  import AppCreatePostItem from "@/components/global/custom/app-create-post-item.vue";

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
  const { locale, t } = useI18n({ useScope: "global" });
  const { eventBus, getEntityName, groupBy, translate } = useUtilities(locale.value);
  const { fetchData } = useApi();
  const { openCreatePosting, openCommunityDetailDialog } = useCommunityDialogService(entityKey);

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
    ["POSTING"].includes(entityKey) ? (directory as CommunityDirectory).communityDirectoryId : 0
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
    $q.notify({
      message: `
      <p style="margin-bottom: 0px;">Create post will cost you 50 points.</p>
      <p style="margin-bottom: 0px;">Are you sure you want to continue?</p>
    `,
      html: true,
      color: "warning",
      position: "center",
      icon: fasTriangleExclamation,
      actions: [
        {
          label: "Yes",
          color: "white",
          handler: async () => {
            // Open the dialog for creating the post
            const dialogName = "PostingListDialog";
            eventBus("DialogStatus").emit(true, dialogName);
            openCreatePosting(isDialogOpen, directory);
          }
        },
        {
          label: "No",
          color: "white", // If the user cancels
          handler: () => {
            // Do nothing, simply dismiss the notification
          }
        }
      ]
    });
  }

  async function handleDetail(item: any) {
    eventBus("DialogStatus").emit(true, dialogName + "Detail");
    openCommunityDetailDialog(isDialogOpen, item, dialogName + "Detail");
  }

  async function fetchAllData() {
    try {
      switch (entityKey) {
        case "POSTING":
          communityItems.value = await fetchData(
            `${ENTITY_URL.POSTING_BY_DIRECTORY}/${directoryId.value}`
          );
          break;

        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
          break;
      }

      // Set the initial tab value
      if (communityItems.value.length > 0 && groupBykey.value) {
        tab.value = tabItems.value.length > 0 ? tabItems.value[0].name : "";
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
