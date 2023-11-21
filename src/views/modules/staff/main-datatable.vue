<template>
  <q-page class="bg-grey-2">
    <app-page-title>{{ $t("staff.title") }}</app-page-title>
    <q-separator />

    <crud-expanded-table
      class="q-ma-md"
      v-model:pagination="pagination"
      row-key="staffId"
      dense
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :actionButtons="actionButtons"
      :expandedRow="expandedRow"
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
  import { defineAsyncComponent, onBeforeUnmount, onMounted, ref, provide } from "vue";
  import { onBeforeRouteLeave } from "vue-router";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useQuasar } from "quasar";

  // .ts files
  import { StaffDatatable } from "@/interfaces/datatable/staff-datatable";

  import eventBus from "@/utils/event-bus";
  import { StaffRole } from "@/interfaces/staffRole";
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
  const AppPageTitle = defineAsyncComponent(
    () => import("@/components/widgets/app-page-title.vue")
  );
  const CrudExpandedTable = defineAsyncComponent(
    () => import("@/components/table/crud-expanded-table.vue")
  );
  const expandedRow = defineAsyncComponent(() => import("./crud-expanded-row/index.vue"));

  const $q = useQuasar();
  const isDialogOpen = ref(false);

  const staffRole = ref<StaffRole[]>([]);
  const error = ref<string | null>(null);

  function onCreate() {
    $q.dialog({
      component: defineAsyncComponent(() => import("./input-dialog/index.vue")),
      componentProps: {
        roles: staffRole
      }
    });
  }

  const onUpdate = (data: StaffDatatable) => {
    $q.dialog({
      component: defineAsyncComponent(() => import("./edit-dialog/index.vue")),
      componentProps: {
        row: data,
        roles: staffRole
      }
    });
  };

  onBeforeRouteLeave((_to, _from, next) => {
    if (isDialogOpen.value) {
      isDialogOpen.value = false;
      eventBus.emit("CloseStaffDilaog");
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

  try {
    const [response] = await Promise.all([axios.get<StaffRole[]>("/StaffRole")]);
    staffRole.value = response.data;
    provide("staffRole", staffRole.value);
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
