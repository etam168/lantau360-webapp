<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card>
      <q-bar class="bg-primary">
        <q-toolbar-title class="text-white">{{ item.directoryName }}</q-toolbar-title>

        <q-space />

        <q-btn dense icon="close" color="red" v-close-popup size="xs">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-none" style="height: 500px; width: 520px">
        <input-step @close-dialog="closeDialog" :directory-id="item.communityDirectoryId" />
      </q-card-section>
    </q-card>
    <!-- End of input content -->
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
