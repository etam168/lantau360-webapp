<template>
  <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
    <q-header class="bg-transparent text-dark">
      <app-dialog-title>{{ "Site Search" }}</app-dialog-title>
    </q-header>

    <q-page-container class="q-mx-md q-my-md">
      <app-search-bar v-model="filter" @on-search="onSearch" />

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
  // 3rd Party Import
  import { useQuasar } from "quasar";

  // .ts file
  import { Site } from "@/interfaces/models/entities/site";
  import useDataTable from "@/composable/use-data-table";

  // Custom Components
  import siteListTable from "./site-list-table.vue";

  const { eventBus } = useUtilities();

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

  async function handleDialog(item: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog.vue")
      ),
      componentProps: {
        item: item as Site
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
