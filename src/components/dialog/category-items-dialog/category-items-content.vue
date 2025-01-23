<!-- category-items-content.vue -->
<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    hide-pagination
    :row-key="rowKey"
    :rows="sortedRows"
    :rows-per-page-options="[0]"
  >
    <template v-slot:top>
      <q-card
        v-if="directory.groupId === SIGHTSEEING_GROUP"
        flat
        bordered
        class="q-ma-md"
        style="width: 100%"
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
        :directory
        :entityKey
        @on-directory-item="onCategoryDetail(row)"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  //Composable import
  import { useSortCategoryItems } from "@/composable/use-sort-categorty-items";
  import { useDirectoryGrouping } from "@/composable/use-directory-grouping";

  // Props
  const {
    directory,
    entityKey,
    sortByKey = "default"
  } = defineProps<{
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    sortByKey?: string;
  }>();

  // Composable function calls
  const $q = useQuasar();
  const { locale } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { getEntityKeyName, translate } = useUtilities(locale.value);
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { sortCategoryTypes } = useSortCategoryItems(entityKey);

  const SIGHTSEEING_GROUP = 5 as const;

  // Reactive variables
  const isDialogOpen = ref(false);
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

  const { tab, directoryTemplate, hasGroup, tabItems, rows, setTab } = useDirectoryGrouping(
    categoryItems,
    directory
  );

  const rowKey = computed(() => `${getEntityKeyName(entityKey)}Id`);

  const sortedRows = computed(() => {
    return sortCategoryTypes(rows.value, sortByKey);
  });

  function onCategoryDetail(item: any) {
    openCategoryDetailDialog(isDialogOpen, item, entityKey, directory.displayMask);
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
          break;
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
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

<style lang="scss" scoped>
  .q-table__top {
    padding: 0 !important;
  }
</style>
