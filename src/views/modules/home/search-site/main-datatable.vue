<template>
  <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
    <q-header class="bg-transparent text-dark">
      <app-dialog-title>{{ "Site Search" }}</app-dialog-title>
    </q-header>

    <q-page-container class="q-mx-md q-my-md">
      <custom-search-input v-model="filter" @search="onSearch" class="q-my-md" />

      <site-list-table
        v-model:pagination="pagination"
        row-key="siteId"
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
  // Vue Import
  import { PropType, defineAsyncComponent, onBeforeUnmount, onMounted } from "vue";
  //import { useRouter } from "vue-router";

  // 3rd Party Import
  import { useQuasar } from "quasar";

  // .ts file
  import eventBus from "@/utils/event-bus";
  import useDataTable from "@/composable/use-data-table";

  // Custom Components
  // import ListingGridTable from "@/components/table/listing-grid-table.vue";
  import siteListTable from "./site-list-table.vue";
  import CustomSearchInput from "@/components/custom/custom-search-input.vue";

  const props = defineProps({
    query: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const url = "/Site/Datatable";
  const key = "siteId";

  const { filter, loading, pagination, rows, loadData, onRefresh, onSearch } = useDataTable(
    url,
    key
  );

  //const router = useRouter();
  const $q = useQuasar();

  function updatePagination(val: any) {
    pagination.value.page = val;
    loadData({ pagination: pagination.value });
  }

  // function handleDetail(rowData: any) {
  //   router.push({
  //     name: "site-detail",
  //     query: { siteId: rowData.siteId }
  //   });
  // }

  async function handleDialog(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("../section/dialog/site-detail-dialog.vue")),
      componentProps: {
        query: { siteId: item.siteId }
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

    //const { query } = router.currentRoute.value;
    // Check if the route query is an object and contains the key searchKeyword
    if (props.query?.searchKeyword !== undefined) {
      // Do something with the searchKeyword value
      filter.value = props.query.searchKeyword as string;
      // keyword.value = filter.value;
    }
    loadData({ pagination: pagination.value });
  });
</script>
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
