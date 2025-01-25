<!-- community-items-content.vue -->
<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    hide-pagination
    separator="cell"
    :row-key="rowKey"
    :rows="sortedRows"
    :rows-per-page-options="[0]"
  >
    <template v-slot:top>
      <app-create-post-item
        :create-title="createTitle"
        :create-description="createDescription"
        @on-create-posting="onCreatePosting"
      />

      <app-tab-select
        v-if="hasGroup"
        :tab-items="tabItems"
        :current-tab="tab"
        @update:currentTab="setTab"
        :class="$q.screen.lt.sm ? 'justify-center' : ''"
      />
    </template>

    <template v-slot:body="{ row }">
      <q-tr>
        <q-td colspan="100%">
          <app-community-item
            :community-item="row"
            @on-detail="handleDetail(row)"
            @on-edit="handleEdit(row)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

  // Constants
  import { ENTITY_URL, EntityURLKey, NONE } from "@/constants";

  // Compontents
  import AppCreatePostItem from "@/components/global/custom/app-create-post-item.vue";

  //Composable imports
  import { useSortCategoryItems } from "@/composable/use-sort-categorty-items";
  import { useDirectoryGrouping } from "@/composable/use-directory-grouping";

  // Props
  const { directory, entityKey } = defineProps<{
    directory: CommunityDirectory;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { locale, t } = useI18n({ useScope: "global" });
  const { getEntityKeyName, getEntityName } = useUtilities(locale.value);
  const { fetchData } = useApi();
  const { openCreatePosting, handleEditPosting, openCommunityDetailDialog } =
    useCommunityDialogService(entityKey);
  const { sortCategoryTypes } = useSortCategoryItems(entityKey);

  // Reactive variables
  const $q = useQuasar();
  const isDialogOpen = ref(false);

  // Reactive variables
  const communityItems: Ref<CategoryTypes[]> = ref([]);

  const { tab, hasGroup, tabItems, rows, setTab } = useDirectoryGrouping(communityItems, directory);

  const rowKey = computed(() => `${getEntityKeyName(entityKey)}Id`);

  const sortedRows = computed(() => {
    return sortCategoryTypes(rows.value, "default");
  });

  const i18nKey = getEntityName(entityKey);
  const createDescription = computed(() => t(`${i18nKey}.mainMenu.addGalleryDescription`));
  const createTitle = computed(() =>
    t(`${i18nKey}.mainMenu.createDirectory`, { directoryName: directory.directoryName })
  );

  const directoryId = computed<number>(() =>
    ["POSTING"].includes(entityKey) ? (directory as CommunityDirectory).communityDirectoryId : 0
  );

  async function onCreatePosting() {
    openCreatePosting(isDialogOpen, directory);
  }

  async function handleDetail(item: any) {
    openCommunityDetailDialog(isDialogOpen, item);
  }

  function handleEdit(item: CategoryTypes) {
    handleEditPosting(isDialogOpen, item, entityKey);
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
    } catch (error) {
      console.error("Error fetching data:", error);

      // Optionally throw the error to handle it upstream
      throw error;
    }
  }

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
