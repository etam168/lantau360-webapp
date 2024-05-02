<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ directoryName }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-card flat class="row justify-center">
            <q-card-section class="q-pa-none" style="height: calc(100vh - 125px); width: 520px">
              <input-step
                @close-dialog="closeDialog"
                :posting-data="postingData"
                :directory-id="directory.communityDirectoryId"
              />
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
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

  const props = defineProps({
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
  const { translateAlt, translate } = useUtilities();
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

  const directoryName = computed(() => {
    const { directoryName, directoryNameAlt } = props.directory as CommunityDirectory;

    // Check if directoryNameAlt exists and is not null
    if (directoryNameAlt !== undefined && directoryNameAlt !== null) {
      return translateAlt(directoryName, directoryNameAlt, "directoryName");
    } else {
      return translate(directoryName, props?.directory?.meta, "directoryName");
    }
  });
</script>
