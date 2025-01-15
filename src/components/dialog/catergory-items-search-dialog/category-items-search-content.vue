<template>
  <app-search-bar :query="queryData" @on-search="onSearch" />

  <app-category-list-items
    :categoryItems="rows"
    :entityKey
    @on-category-detail="onCategoryDetail"
  />
</template>

<script setup lang="ts">
  // .ts files
  import useDataTable from "@/composable/use-data-table";

  // Constants
  import { EntityURLKey } from "@/constants";

  const { eventBus } = useUtilities();

  // Props
  const { query, entityKey } = defineProps<{
    query: any;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const $q = useQuasar();

  // Reactive variables
  const queryData = ref(query.searchKeyword);

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

  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { filter, loading, pagination, rows, loadData, onRefresh, onSearch } = useDataTable(
    tableUrl.value,
    tableKey.value
  );

  function updatePagination(val: any) {
    pagination.value.page = val;
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
    if (query?.searchKeyword !== undefined) {
      // Do something with the searchKeyword value
      filter.value = query.searchKeyword as string;
      pagination.value.rowsPerPage = 100;
      // keyword.value = filter.value;
    }
    loadData({ pagination: pagination.value });
  });
</script>
