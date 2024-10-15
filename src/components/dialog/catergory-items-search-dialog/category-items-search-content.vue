<template>
  <app-search-bar :query="queryData" @on-search="onSearch" />

  <list-table
    v-model:pagination="pagination"
    :row-key="tableKey"
    :rows="rows"
    :entityKey
    :loading="loading"
    @on-detail="handleDialog"
    @on-pagination="updatePagination"
    @request="loadData"
  />
</template>

<script setup lang="ts">
  // Interface files
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts files
  import useDataTable from "@/composable/use-data-table";

  // Custom Components
  import listTable from "./list-table.vue";

  // Constants
  import { EntityURLKey } from "@/constants/app/entity-url";

  const { eventBus } = useUtilities();

  // Props
  const { query, entityKey } = defineProps<{
    query: any;
    entityKey: EntityURLKey;
  }>();

  // Dynamically set URL and key based on entityKey
  const urlAndKey = computed(() => {
    switch (entityKey) {
      case "SITE":
        return { url: "/Site/Datatable", key: "siteId" };
      // Add more cases as needed
      default:
        return { url: "/Site/Datatable", key: "siteId" }; // Default case
    }
  });

  const tableUrl = computed(() => urlAndKey.value.url);
  const tableKey = computed(() => urlAndKey.value.key);

  const { filter, loading, pagination, rows, loadData, onRefresh, onSearch } = useDataTable(
    tableUrl.value,
    tableKey.value
  );
  const queryData = ref(query.searchKeyword);
  const $q = useQuasar();

  function updatePagination(val: any) {
    pagination.value.page = val;
    loadData({ pagination: pagination.value });
  }

  async function handleDialog(item: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog.vue")
      ),
      componentProps: {
        item: item as SiteView
      }
    });
  }

  onBeforeUnmount(() => {
    eventBus.off("LoadData");
  });

  onMounted(() => {
    eventBus.on("LoadData", () => {
      loadData({ pagination: pagination.value });
      onRefresh();
    });

    // Check if the route query is an object and contains the key searchKeyword
    if (query?.searchKeyword !== undefined) {
      // Do something with the searchKeyword value
      filter.value = query.searchKeyword as string;
      // keyword.value = filter.value;
    }
    loadData({ pagination: pagination.value });
  });
</script>
