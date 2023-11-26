<template>
  <q-page class="bg-grey-2">
    <app-page-title>{{ $t("site.title") }}</app-page-title>

    <q-separator />
    <crud-expanded-table
      class="q-ma-md"
      v-model:pagination="pagination"
      row-key="siteId"
      dense
      :expandedRow="expandedRow"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :actionButtons="actionButtons"
      :toolTipCreate="toolTipCreate"
      @on-create="onCreate"
      @on-update="onUpdate"
      @on-refresh="onRefresh"
      @on-search="onSearch"
      @request="loadData"
      @on-rowsperpage-change="handlePageCountChange"
    />
  </q-page>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, onMounted, onBeforeUnmount, defineAsyncComponent, provide } from "vue";

  // 3rd Party Modules
  import axios, { AxiosError } from "axios";
  import { useRouter, onBeforeRouteLeave } from "vue-router";

  // .ts files
  import eventBus from "@/utils/event-bus";
  import { Directory } from "@/interfaces/models/entities/directory";
  import {
    actionButtons,
    pagination,
    rows,
    columns,
    loading,
    filter,
    onRefresh,
    onSearch,
    loadData,
    toolTipCreate
  } from "./use-table-options";

  // Custom Components
  import AppPageTitle from "@/components/widgets/app-page-title.vue";
  import CrudExpandedTable from "@/components/table/crud-expanded-table.vue";

  const expandedRow = defineAsyncComponent(() => import("./crud-expanded-row/index.vue"));

  const isDialogOpen = ref(false);
  const isSiteDialogOpen = ref(false);

  const directoryList = ref<Directory[]>([]);
  const error = ref<string | null>(null);

  const router = useRouter();

  function onUpdate() {}

  const onCreate = () => {};

  onBeforeRouteLeave((_to, _from, next) => {
    if (isSiteDialogOpen.value) {
      isSiteDialogOpen.value = false;
      eventBus.emit("CloseBusinessDilaog");
      next(false);
    } else if (isDialogOpen.value) {
      isDialogOpen.value = false;
      eventBus.emit("CloseDilaog");
      next(false);
    } else {
      next();
    }
  });

  onMounted(() => {
    // loadData({ pagination: pagination.value });

    eventBus.on("LoadData", () => {
      loadData({ pagination: pagination.value });
      onRefresh();
    });

    const { query } = router.currentRoute.value;

    // Check if the route query is an object and contains the key searchKeyword
    if (query?.searchKeyword !== undefined) {
      // Do something with the searchKeyword value
      filter.value = query.searchKeyword as string;
    }
    debugger;

    loadData({ pagination: pagination.value });
  });

  onBeforeUnmount(() => {
    eventBus.off("LoadData");
  });

  function handlePageCountChange(val: any) {
    if (val != null) {
      pagination.value.rowsPerPage = val;
      loadData({
        filter: filter.value,
        pagination: pagination.value
      });
    }
  }

  try {
    const [response] = await Promise.all([
      axios.get<Directory[]>("/Directory/DirectoryGroupsData/1")
    ]);
    directoryList.value = response.data;
    provide("directoryList", directoryList.value);
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.status === 404) {
        error.value = "Not found";
      } else {
        error.value = "An error occurred";
      }
    } else {
      error.value = "An unexpected error occurred";
    }
  }
</script>
