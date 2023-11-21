<template>
  <q-page class="bg-grey-2">
    <app-page-title>{{ $t("directory.title") }}</app-page-title>
    <q-separator />

    <crud-table
      class="q-ma-md"
      v-model:pagination="pagination"
      row-key="directoryId"
      dense
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
  import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from "vue";
  import { onBeforeRouteLeave } from "vue-router";

  // 3rd Party Import
  import { useQuasar } from "quasar";

  // .ts files
  // import { BuildingInput } from "@/interfaces/input/directory-input";
  import { DirectoryDatatable } from "@/interfaces/datatable/directory-datatable";

  import eventBus from "@/utils/event-bus";

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

  const AppPageTitle = defineAsyncComponent(
    () => import("@/components/widgets/app-page-title.vue")
  );

  const CrudTable = defineAsyncComponent(() => import("@/components/table/crud-table.vue"));
  //const expandedRow = defineAsyncComponent(() => import("./crud-expanded-row/index.vue"));

  const $q = useQuasar();
  const isDialogOpen = ref(false);

  const onCreate = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("./input-dialog/index.vue"))
    });
  };

  const onUpdate = (data: DirectoryDatatable) => {
    $q.dialog({
      component: defineAsyncComponent(() => import("./edit-dialog/index.vue")),
      componentProps: {
        row: data
      }
    });
  };

  onBeforeRouteLeave((_to, _from, next) => {
    if (isDialogOpen.value) {
      isDialogOpen.value = false;
      eventBus.emit("CloseDirectoryDilaog");
      next(false);
    } else {
      next();
    }
  });

  onMounted(() => {
    loadData({ pagination: pagination.value });

    eventBus.on("LoadData", () => {
      loadData({ pagination: pagination.value });
      onRefresh();
    });

    eventBus.on("DialogStatus", (dialogStatus: boolean) => {
      isDialogOpen.value = dialogStatus;
    });

    eventBus.on("dataUpdated", () => {
      onRefresh();
    });
  });

  onBeforeUnmount(() => {
    eventBus.off("LoadData");
    eventBus.off("dataUpdated");
    eventBus.off("DialogStatus");
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
</script>
