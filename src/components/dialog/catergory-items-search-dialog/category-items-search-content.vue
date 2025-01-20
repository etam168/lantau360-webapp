<template>
  <q-card-actions align="center">
    <app-search-bar
      v-model:keyword="keyword"
      @on-search="onSearch"
      @on-clear-input="onClearInput"
    />
  </q-card-actions>

  <app-category-list-items
    :categoryItems="rows"
    :entityKey
    :sortByKey="sortByKey"
    :style="tableStyle"
    @on-category-detail="onCategoryDetail"
  />
</template>

<script setup lang="ts">
  import useDataTable from "@/composable/use-data-table";
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Props
  const { entityKey, sortByKey = "default" } = defineProps<{
    entityKey: EntityURLKey;
    sortByKey?: string;
  }>();

  // v-model
  const keyword = defineModel<string>("keyword", {
    required: false,
    default: ""
  });

  // Composable function calls
  const $q = useQuasar();
  const { getEntityKeyName } = useUtilities();

  const entityUrl = computed(() => `${ENTITY_URL[entityKey]}/Datatable`);
  const THRESHOLD = 150;

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const tabHeight = 120;
    const usedHeight = tabHeight;

    const hasEnoughSpace = $q.screen.height > THRESHOLD;

    switch (true) {
      case hasEnoughSpace:
        return { height: `calc(100vh - ${usedHeight}px)` };
      default:
        return undefined;
    }
  });

  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { filter, pagination, rows, loadData } = useDataTable(
    entityUrl.value,
    getEntityKeyName(entityKey)
  );

  function onClearInput() {
    rows.value = [];
  }

  function onSearch(val: any) {
    filter.value = val;
    loadData({ pagination: pagination.value });
  }

  async function onCategoryDetail(item: any) {
    openCategoryDetailDialog(item, entityKey);
  }

  onMounted(() => {
    // Check if the route query is an object and contains the key searchKeyword
    if (keyword !== undefined) {
      // Do something with the searchKeyword value
      filter.value = keyword.value;
      pagination.value.rowsPerPage = 100;
    }
    loadData({ pagination: pagination.value });
  });
</script>
