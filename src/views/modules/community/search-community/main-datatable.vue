<template>
  <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
    <q-header class="bg-transparent text-dark">
      <app-dialog-title>{{ "Community Search" }}</app-dialog-title>
    </q-header>

    <q-page-container class="q-mx-md q-my-md">
      <app-search-bar v-model="filter" @on-search="onSearch" />

      <community-list-table
        v-model:pagination="pagination"
        row-key="communityDirectoryId"
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
  import CommunityListTable from "./community-list-table.vue";

  const props = defineProps({
    query: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const url = "/Posting/Datatable";
  const key = "postingId";

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
  //     name: "community-detail",
  //     query: { directoryId: rowData.directoryId }
  //   });
  // }

  async function handleDialog(item: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-detail-dialog.vue")
      ),
      componentProps: {
        query: { directoryId: item.communityDirectoryId }
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
