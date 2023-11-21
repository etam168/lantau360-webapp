<template>
  <q-page class="q-pa-none column">
    <app-page-title>{{ $t("posting.title") }}</app-page-title>

    <q-card class="col q-pa-md">
      <q-card-section>
        <crud-table
          v-model:pagination="pagination"
          row-key="postingId"
          :rows="rows"
          :expandedRow="expandedRow"
          :columns="columns"
          :loading="loading"
          :filter="filter"
          :actionButtons="actionButtons"
          :toolTipCreate="toolTipCreate"
          @on-create="onCreate"
          @on-update="onUpdate"
          @on-gallery="onGallery"
          @on-refresh="onRefresh"
          @on-search="onSearch"
          @request="loadData"
        >
        </crud-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
  import { onBeforeRouteLeave } from "vue-router";

  // 3rd Party Modules
  import axios from "axios";
  import eventBus from "@/utils/event-bus";
  import i18n from "@/plugins/i18n/i18n";
  import { useQuasar } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";

  // .ts files
  import { Posting } from "@/interfaces/posting";
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

  export default defineComponent({
    name: "postingIndex",

    components: {
      AppPageTitle: defineAsyncComponent(() => import("@/components/widgets/app-page-title.vue")),
      CrudTable: defineAsyncComponent(() => import("@/components/table/crud-expanded-table.vue"))
    },

    setup() {
      const $q = useQuasar();
      const { t } = i18n.global;
      const isDialogOpen = ref(false);
      const { notify } = useUtilities();

      function onUpdate(data: Posting) {
        showCreateUpdateDialog(data, "edit", t("posting.dialoge.edit"));
      }

      function onCreate() {
        const data = {} as Posting;
        [data.postingId, data.latitude, data.longitude] = [0, 22, 112];

        showCreateUpdateDialog(data, "create", t("posting.dialoge.create"));
      }

      function showCreateUpdateDialog(data: Posting, method: string, title: string) {
        $q.loading.show({
          message: "Loading data. Hang on..."
        });

        axios
          .get(`/Directory/DirectoryGroupsData/1`)
          .then(response => {
            const directories = response.data;
            $q.loading.hide();
            $q.dialog({
              component: defineAsyncComponent(() => import("./input-dialog/index.vue")),
              componentProps: {
                row: data,
                method: method,
                directory: directories,
                title: title
              }
            });
          })
          .catch(errors => {
            if (errors.message == "Network Error") {
              notify("No Internet Connection", "negative");
            } else {
              notify(errors.message, "negative");
            }
            $q.loading.hide();
          });
      }

      function onGallery(data: Posting) {
        $q.dialog({
          component: defineAsyncComponent(
            () => import("./crud-expanded-row/posting-gallery-dialog.vue")
          ),
          componentProps: {
            props: data
          }
        });
      }

      onBeforeRouteLeave((_to, _from, next) => {
        if (isDialogOpen.value) {
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

        eventBus.on("DialogStatus", (dialogStatus: boolean) => {
          isDialogOpen.value = dialogStatus;
        });
      });

      onBeforeUnmount(() => {
        eventBus.off("LoadData");
        eventBus.off("DialogStatus");
      });

      return {
        expandedRow: defineAsyncComponent(() => import("./crud-expanded-row/index.vue")),

        pagination,
        rows,
        columns,
        loading,
        filter,
        toolTipCreate,
        actionButtons,

        onCreate,
        onUpdate,
        onGallery,
        onRefresh,
        onSearch,
        loadData
      };
    }
  });
</script>
