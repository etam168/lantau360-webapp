<template>
  <q-card-actions align="center">
    <app-search-bar v-model:keyword="keyword" @on-search="onSearch" />
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
  import { EntityURLKey } from "@/constants";

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
  const { eventBus } = useUtilities();

  // Dynamically set URL and key based on entityKey
  const urlAndKey = computed(() => {
    switch (entityKey) {
      case "SITE":
        return { url: "/Site/Datatable", key: "siteId" };
      case "BUSINESS":
        return { url: "/Business/Datatable", key: "businessId" };
      default:
        return { url: "", key: "" }; // Default case
    }
  });

  const tableUrl = computed(() => urlAndKey.value.url);
  const tableKey = computed(() => urlAndKey.value.key);
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
  const { filter, pagination, rows, loadData, onRefresh } = useDataTable(
    tableUrl.value,
    tableKey.value
  );

  function onSearch(val: any) {
    filter.value = val;
    loadData({ pagination: pagination.value });
  }

  async function onCategoryDetail(item: any) {
    const detailDialogName = "serachItem" + "Detail";
    eventBus("DialogStatus").emit(true, detailDialogName);
    openCategoryDetailDialog(item, detailDialogName, entityKey);
  }

  // Lifecycle hooks
  onBeforeUnmount(() => {
    eventBus("LoadData").off(() => {});
  });

  onMounted(() => {
    eventBus("LoadData").on(() => {
      loadData({ pagination: pagination.value });
      onRefresh();
    });

    // Check if the route query is an object and contains the key searchKeyword
    if (keyword !== undefined) {
      // Do something with the searchKeyword value
      filter.value = keyword.value;
      pagination.value.rowsPerPage = 100;
    }
    loadData({ pagination: pagination.value });
  });
</script>
