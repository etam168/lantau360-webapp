<template>
  <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
    <q-header class="bg-transparent text-dark">
      <app-dialog-title>{{ $t("business.businessSearch") }}</app-dialog-title>
    </q-header>

    <q-page-container class="q-mx-md q-my-md">
      <app-search-bar :query="queryData" @on-search="onSearch" />

      <business-list-table
        v-model:pagination="pagination"
        row-key="businessId"
        :rows="rows"
        :loading="loading"
        @on-detail="handleDialog"
        @on-pagination="updatePagination"
        @request="loadData"
      />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";

  // .ts files
  import useDataTable from "@/composable/use-data-table";

  // Custom Components
  import BusinessListTable from "./business-list-table.vue";

  const { eventBus } = useUtilities();

  const props = defineProps({
    query: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const url = "/Business/Datatable";
  const key = "businessId";

  const { filter, loading, pagination, rows, loadData, onRefresh, onSearch } = useDataTable(
    url,
    key
  );
  const queryData = ref(props.query.searchKeyword);

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
        item: item as BusinessView
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
    if (props.query?.searchKeyword !== undefined) {
      // Do something with the searchKeyword value
      filter.value = props.query.searchKeyword as string;
      // keyword.value = filter.value;
    }

    loadData({ pagination: pagination.value });
  });
</script>
