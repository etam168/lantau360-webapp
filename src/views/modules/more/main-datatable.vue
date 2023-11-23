<template>
  <q-page class="bg-grey-2">
    <app-page-title>{{ $t("business.title") }}</app-page-title>
    <q-separator />

    <crud-expanded-table
      class="q-ma-md"
      v-model:pagination="pagination"
      row-key="businessId"
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
  import { onBeforeRouteLeave } from "vue-router";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useQuasar } from "quasar";
  import { useRouter } from "vue-router";

  // .ts files
  import eventBus from "@/utils/event-bus";
  import { Directory } from "@/interfaces/models/entities/directory";

  import {
    actionButtons,
    columns,
    filter,
    loading,
    loadData,
    onRefresh,
    onSearch,
    pagination,
    rows,
    toolTipCreate
  } from "./use-table-options";
  // import { BusinessDatatable } from "@/interfaces/datatable/business-datatable";

  // Custom Components
  import AppPageTitle from "@/components/widgets/app-page-title.vue";
  import CrudExpandedTable from "@/components/table/crud-expanded-table.vue";
  import { BusinessInput } from "@/interfaces/input/business-input";
  import { BusinessImages } from "@/interfaces/models/gallery";

  const expandedRow = defineAsyncComponent(() => import("./crud-expanded-row/index.vue"));

  // const router = useRouter();

  const $q = useQuasar();
  const isDialogOpen = ref(false);
  const isBusinessDialogOpen = ref(false);

  const previewData = ref<BusinessInput>({} as BusinessInput);
  const businessImages = ref<BusinessImages>({} as BusinessImages);
  const directoryList = ref<Directory[]>([]);
  const error = ref<string | null>(null);

  provide("images", businessImages);
  provide("previewData", previewData);

  const router = useRouter();

  const onCreate = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("./input-dialog/index.vue")),
      componentProps: {
        directoryList: directoryList.value
      }
    });
  };

  onBeforeRouteLeave((_to, _from, next) => {
    if (isBusinessDialogOpen.value) {
      isBusinessDialogOpen.value = false;
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
    loadData({ pagination: pagination.value });

    eventBus.on("LoadData", () => {
      loadData({ pagination: pagination.value });
      onRefresh();
    });

    eventBus.on("DialogStatus", (dialogStatus: boolean, isListingDialog: boolean = false) => {
      if (isListingDialog) {
        isDialogOpen.value = dialogStatus;
      } else {
        isBusinessDialogOpen.value = dialogStatus;
      }
    });

    eventBus.on("ImageDeleted", () => {
      loadData({ pagination: pagination.value });
      onRefresh();
    });

    // eventBus.on("filterTable", (val: any) => {
    //   filterTable(val);
    // });

    const { query } = router.currentRoute.value;
    if (query?.queryParam !== undefined) {
      onCreate();
    }
  });

  onBeforeUnmount(() => {
    eventBus.off("LoadData");
    eventBus.off("DialogStatus");
    eventBus.off("ImageDeleted");
  });

  // function filterTable(val: any) {
  //   debugger;
  //   if (val != null) {
  //     if (val.length != 0) {
  //       filterOptions.value = JSON.stringify(val);
  //     }
  //     loadData({
  //       filter: filter.value,
  //       filterOptions: filterOptions.value,
  //       pagination: pagination.value
  //     });
  //   }
  // }

  function onUpdate(data: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("./edit-dialog/index.vue")),
      componentProps: {
        directoryList: directoryList.value,
        row: data
      }
    });
  }

  // function onGallery(data: BusinessDatatable) {
  //   $q.dialog({
  //     component: defineAsyncComponent(
  //       () => import("./crud-expanded-row/business-gallery-dialog.vue")
  //     ),
  //     componentProps: {
  //       props: data
  //     }
  //   });
  // }

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
      axios.get<Directory[]>("/Directory/DirectoryGroupsData/2")
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
