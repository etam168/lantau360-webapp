<template>
  <q-dialog
    ref="dialogRef"
    @update:model-value="onDialogHide"
    :model-value="dialogVisibility"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-green-1">
      <q-layout view="hHh lpR fFf">
        <app-dialog-bar :barTitle="barTitle" />

        <q-page-container>
          <div class="q-pa-md">
            <q-file
              ref="imageRef"
              v-show="false"
              v-model="imagePath"
              @update:model-value="uploadImage"
            >
            </q-file>

            <crud-grid-table
              v-model:pagination="pagination"
              row-key="imageId"
              :rows="rows"
              :loading="loading"
              :CrudGridTopSlot="CrudGridTopSlot"
              :CrudGridCard="CrudGridCard"
              :toolTipCreate="toolTipCreate"
              @on-create="uploadGalleryImage"
              @on-delete="deleteGalleryDialog"
              @on-refresh="onRefresh"
            />
          </div>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { onMounted, ref } from "vue";

  // 3rd Party Modules
  import axios from "axios";
  import eventBus from "@/utils/event-bus";
  import { useUtilities } from "@/composable/use-utilities";
  import { useDialogPluginComponent } from "quasar";

  //.ts
  import { SiteImage } from "@/interfaces/siteImage";
  import { useSiteInput } from "../shared/use-site-input";

  // Composable
  import useDataTable from "@/composable/use-data-table";
  import useShowCrudDialogs from "@/composable/use-show-crud-dialogs";

  // Custom Components
  import AppDialogBar from "@/components/dialogs/app-dialog-bar.vue";
  import CrudGridCard from "./crud-grid-card.vue";
  import CrudGridTable from "@/components/table/crud-grid-table.vue";
  import CrudGridTopSlot from "@/components/table/crud-grid-top-slot.vue";

  const { notify } = useUtilities();

  const props = defineProps({
    props: {
      type: Object
    }
  });

  defineEmits([...useDialogPluginComponent.emits, "on-refresh"]);

  const { dialogRef } = useDialogPluginComponent();
  const { showDeleteDialog } = useShowCrudDialogs();
  const { imagePath, toolTipCreate } = useSiteInput();

  const barTitle = ref("Site Gallery");
  const imageRef = ref();
  const dialogVisibility = ref();

  const url = "/SiteImage/DatatableById";
  const key = "imageId";
  const optParams = {
    siteId: props?.props?.siteId,
    isSite: false
  };

  const { loading, pagination, onRefresh, loadData, rows } = useDataTable(url, key, optParams);

  onMounted(() => {
    loadData({ pagination: pagination.value });
    eventBus.on("RefreshGallery", () => {
      onRefresh();
    });

    eventBus.on("CloseDilaog", () => {
      dialogVisibility.value = false;
      eventBus.emit("RefreshExpandedGallery", props?.props?.siteId);
    });
  });

  function uploadGalleryImage() {
    imageRef.value.pickFiles();
    if (imagePath.value != null) {
      uploadImage();
    }
  }

  function uploadImage() {
    const url = `/SiteImage/${props?.props?.siteId}`;

    if (imagePath.value != null) {
      const formData = new FormData();
      formData.append("image", imagePath.value);

      const headers = {
        "Content-Type": "multipart/form-data"
      };

      const params = {
        ranking: 0,
        createdBy: 0,
        modifiedBy: 0
      };
      loading.value = true;
      axios
        .post(url, formData, {
          params: params,
          headers: headers
        })
        .then(
          () => {
            onRefresh();

            loading.value = false;
          },
          error => {
            notify(error.message, "negative");
            loading.value = false;
          }
        );
      imagePath.value = null;
    }
  }

  function deleteGalleryDialog(row: SiteImage) {
    const data = row as SiteImage;
    const title = "site.delete";
    const prompt = data.imagePath;
    const url = `/SiteImage/${data.imageId}`;
    const successMessage = "site.message.deleteImage";

    showDeleteDialog(title, prompt, url, successMessage, "deleteGallery");
  }

  function onDialogHide(showStatus: any) {
    eventBus.emit("DialogStatus", showStatus);
    dialogVisibility.value = showStatus;
    if (!showStatus) {
      eventBus.emit("RefreshExpandedGallery", props?.props?.siteId);
    }
  }
</script>
