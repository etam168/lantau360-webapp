<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title> {{ item.directoryName }} </app-dialog-title>
      </q-header>
      <q-page-container>
        <q-card-section style="height: calc(100vh - 32px)">
          <input-step @close-dialog="closeDialog" :directory-id="item.communityDirectoryId" />
        </q-card-section>
        <!-- End of input content -->
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { Description } from "@/interfaces/models/custom-models/description";
  import { PostingView } from "@/interfaces/models/views/posting-view";
  import { PostingImages } from "@/interfaces/models/custom-models/gallery";

  // Custom Components
  import InputStep from "./input-step.vue";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

  defineEmits([...useDialogPluginComponent.emits]);

  defineProps({
    item: {
      type: Object as PropType<CommunityDirectory>,
      required: true
    }
  });

  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const previewData = ref<PostingView>({} as PostingView);
  const postingImages = ref<PostingImages>({} as PostingImages);
  const description = ref<Description>({} as Description);

  provide("images", postingImages);
  provide("previewData", previewData);
  provide("description", description);

  const closeDialog = () => {
    setTimeout(() => {
      onDialogCancel();
    }, 1200);
  };

  onMounted(() => {
    // eventBus.on("CloseDilaog", () => {
    //   isDialogVisible.value = false;
    // });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    // eventBus.emit("DialogStatus", status, true);
  }
</script>
