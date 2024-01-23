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
      <q-list dense>
        <q-item>
          <q-item-label class="text-h6 q-py-sm"> {{ directory.directoryName }}</q-item-label>
        </q-item>
        <q-separator style="height: 3px" />

        <q-card-section class="bg-red q-pa-none" style="height: 500px; width: 520px">
          <input-step
            @close-dialog="closeDialog"
            :posting-data="postingData"
            :directory-id="directory.communityDirectoryId"
          />
        </q-card-section>
      </q-list>
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
  import { Posting } from "@/interfaces/models/entities/posting";

  defineEmits([...useDialogPluginComponent.emits]);

  defineProps({
    directory: {
      type: Object as PropType<CommunityDirectory>,
      required: true
    },
    postingData: {
      type: Object as PropType<Posting>,
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
