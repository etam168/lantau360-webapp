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

<script lang="ts">
  import { defineComponent, onMounted, ref } from "vue";

  // 3rd Party Modules
  import axios from "axios";
  import eventBus from "@/utils/event-bus";
  import { useDialogPluginComponent } from "quasar";
  //.ts
  import { PostingImage } from "@/interfaces/postingImage";
  import usePostingInput from "../input-dialog/use-posting-input";

  // Composable
  import useDataTable from "@/composable/use-data-table";
  import useShowCrudDialogs from "@/composable/use-show-crud-dialogs";

  // Custom Components
  import AppDialogBar from "@/components/dialogs/app-dialog-bar.vue";
  import CrudGridCard from "./crud-grid-card.vue";
  import CrudGridTable from "@/components/table/crud-grid-table.vue";
  import CrudGridTopSlot from "@/components/table/crud-grid-top-slot.vue";

  export default defineComponent({
    name: "PostingGalleryDialog",

    props: {
      props: {
        type: Object
      }
    },

    components: {
      AppDialogBar,
      CrudGridTable
    },

    emits: [...useDialogPluginComponent.emits, "on-refresh"],

    setup(props) {
      const { dialogRef, onDialogCancel } = useDialogPluginComponent();
      const { showDeleteDialog } = useShowCrudDialogs();
      const { imagePath, toolTipCreate } = usePostingInput();

      const barTitle = ref("Posting Gallery");
      const imageRef = ref();
      const dialogVisibility = ref();

      const url = "/PostingImage/DatatableById";
      const key = "imageId";
      const optParams = {
        postingId: props?.props?.postingId,
        isSite: true
      };

      const { loading, pagination, onRefresh, loadData, rows } = useDataTable(url, key, optParams);

      onMounted(() => {
        loadData({ pagination: pagination.value });
        eventBus.on("RefreshGallery", () => {
          onRefresh();
        });

        eventBus.on("CloseDilaog", () => {
          dialogVisibility.value = false;
          eventBus.emit("RefreshExpandedGallery", props?.props?.postingId);
        });
      });

      function uploadGalleryImage() {
        imageRef.value.pickFiles();
        if (imagePath.value != null) {
          uploadImage();
        }
      }

      function uploadImage() {
        const url = `/PostingImage/${props?.props?.postingId}`;

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
                console.log(error);
                loading.value = false;
              }
            );
          imagePath.value = null;
        }
      }

      function deleteGalleryDialog(row: PostingImage) {
        const data = row as PostingImage;
        const title = "posting.delete";
        const prompt = data.imagePath;
        const url = `/PostingImage/${data.imageId}`;
        const successMessage = "posting.message.deleteImage";

        showDeleteDialog(title, prompt, url, successMessage, "deleteGallery");
      }

      function onDialogHide(showStatus: any) {
        eventBus.emit("DialogStatus", showStatus);
        dialogVisibility.value = showStatus;
        if (!showStatus) {
          eventBus.emit("RefreshExpandedGallery", props?.props?.postingId);
        }
      }

      return {
        dialogRef,
        imagePath,
        imageRef,

        deleteGalleryDialog,
        uploadGalleryImage,
        dialogVisibility,

        loading,
        pagination,
        rows,
        toolTipCreate,

        onDialogHide,
        onDialogCancel,
        uploadImage,
        CrudGridCard,
        CrudGridTopSlot,
        onRefresh,
        barTitle
      };
    }
  });
</script>
