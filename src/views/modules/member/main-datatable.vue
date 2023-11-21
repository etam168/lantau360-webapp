<template>
  <q-page class="bg-grey-2">
    <app-page-title>{{ $t("member.title") }}</app-page-title>
    <q-separator />

    <crud-expanded-table
      class="q-ma-md"
      v-model:pagination="pagination"
      row-key="memberId"
      dense
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :actionButtons="actionButtons"
      :buttonOption="buttonOption"
      :toolTipCreate="toolTipCreate"
      :expandedRow="expandedRow"
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
  import { MemberDatatable } from "@/interfaces/datatable/member-datatable";

  import eventBus from "@/utils/event-bus";

  import {
    actionButtons,
    buttonOption,
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
  const AppPageTitle = defineAsyncComponent(
    () => import("@/components/widgets/app-page-title.vue")
  );

  const CrudExpandedTable = defineAsyncComponent(
    () => import("@/components/table/crud-expanded-table.vue")
  );
  const expandedRow = defineAsyncComponent(() => import("./crud-expanded-row/index.vue"));

  const $q = useQuasar();
  const isDialogOpen = ref(false);

  const onUpdate = (data: MemberDatatable) => {
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
      eventBus.emit("CloseMemberDilaog");
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
