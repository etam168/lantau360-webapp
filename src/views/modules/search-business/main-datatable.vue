<template>
  <q-page class="bg-grey-2">
    <q-card flat square>
      <q-toolbar
        class="q-pa-none bg-grey-3 q-ma-lg"
        style="overflow: hidden; border-radius: 24px; height: 48px; max-width: 960px"
      >
        <q-separator vertical />
        <custom-search-input v-model="filter" @search="onSearch" />
      </q-toolbar>
      <q-card-section class="q-py-xs">
        <business-list-table
          v-model:pagination="pagination"
          row-key="businessId"
          :rows="rows"
          :loading="loading"
          @on-detail="handleDetail"
          @on-pagination="updatePagination"
          @request="loadData"
        />
      </q-card-section>

      <!-- <q-card-section v-else class="q-pa-none">
        <no-data />
      </q-card-section> -->
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  // Vue Import
  import { onBeforeUnmount, onMounted } from "vue";
  import { useRouter } from "vue-router";

  // 3rd Party Import

  // .ts file
  import eventBus from "@/utils/event-bus";
  import useDataTable from "@/composable/use-data-table";

  // Custom Components
  // import ListingGridTable from "@/components/table/listing-grid-table.vue";
  import BusinessListTable from "./business-list-table.vue";
  import CustomSearchInput from "@/components/custom/custom-search-input.vue";
  // import NoData from "@/components/custom/no-data.vue";

  const url = "/Business/Datatable";
  const key = "businessId";

  const { filter, loading, pagination, rows, loadData, onRefresh, onSearch } = useDataTable(
    url,
    key
  );

  const router = useRouter();

  function updatePagination(val: any) {
    pagination.value.page = val;
    loadData({ pagination: pagination.value });
  }

  function handleDetail(rowData: any) {
    router.push({
      name: "business-detail",
      query: { businessId: rowData.businessId }
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

    const { query } = router.currentRoute.value;

    // Check if the route query is an object and contains the key searchKeyword
    if (query?.searchKeyword !== undefined) {
      // Do something with the searchKeyword value
      filter.value = query.searchKeyword as string;
      // keyword.value = filter.value;
    }
    loadData({ pagination: pagination.value });
  });
</script>
