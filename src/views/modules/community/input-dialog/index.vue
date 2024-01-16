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
      <q-page-container>
        <q-card class="bg-transparent">
          <!--  Input content -->
          <q-splitter
            v-model="splitterModel"
            unit="px"
            :limits="[INPUT_PANE_WIDTH, INPUT_PANE_WIDTH]"
            class="bg-transparent"
            style="height: calc(100vh - 32px)"
            v-if="$q.screen.gt.sm"
          >
            <template v-slot:before>
              <input-step @close-dialog="closeDialog" :directory-id="directoryId" />
            </template>

            <template v-slot:after>
              <!-- <app-editor /> -->
            </template>
          </q-splitter>

          <q-card-section v-else style="height: calc(100vh - 32px)">
            <input-step @close-dialog="closeDialog" :directory-id="directoryId" />
          </q-card-section>
          <!-- End of input content -->
        </q-card>
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

  defineEmits([...useDialogPluginComponent.emits]);

  defineProps({
    directoryId: {
      type: Number,
      required: true
    }
  });

  const INPUT_PANE_WIDTH = 480;

  const splitterModel = ref(INPUT_PANE_WIDTH);

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
