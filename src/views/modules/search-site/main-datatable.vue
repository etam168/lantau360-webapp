<template>
  <q-card flat square style="max-width: 1024px">
    <q-layout view="hHh lpR fFf">
      <q-card-actions align="center" class="button-margin">
        <q-btn dense flat icon="arrow_back" v-close-popup> </q-btn>
        <q-space />
        <q-toolbar
          class="q-pa-none bg-grey-3 q-ma-lg"
          style="overflow: hidden; border-radius: 24px; height: 48px; max-width: 860px"
        >
          <q-separator vertical />
          <custom-search-input v-model="filter" @search="onSearch" />
        </q-toolbar>
        <q-space />
      </q-card-actions>

      <q-page-container class="q-mx-xl q-my-md">
        <q-card-section class="q-py-xs">
          <site-list-table
            v-model:pagination="pagination"
            row-key="siteId"
            :rows="rows"
            :loading="loading"
            @on-detail="handleDialog"
            @on-pagination="updatePagination"
            @request="loadData"
          />
        </q-card-section>
      </q-page-container>
    </q-layout>

    <!-- <q-card-section v-else class="q-pa-none">
        <no-data />
      </q-card-section> -->
  </q-card>
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
  // import NoData from "@/components/custom/no-data.vue";

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
      component: defineAsyncComponent(() => import("../site-directory/site-detail-dialog.vue")),
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
