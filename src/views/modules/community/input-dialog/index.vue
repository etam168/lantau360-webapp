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
    <q-card class="bg-grey-4">
      <q-layout view="hHh lpR fFf">
        <app-dialog-bar :barTitle="$t('posting.dialoge.create')" />

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
                <input-step @close-dialog="closeDialog" />
              </template>

              <template v-slot:after>
                <app-editor />
              </template>
            </q-splitter>

            <q-card-section v-else style="height: calc(100vh - 32px)">
              <input-step @close-dialog="closeDialog" />
            </q-card-section>
            <!-- End of input content -->
          </q-card>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, provide, onMounted } from "vue";

  // 3rd Party Import
  import { useDialogPluginComponent } from "quasar";

  // .ts files
  // import eventBus from "@/utils/event-bus";

  // Custom Components
  import InputStep from "./input-step.vue";

  import { Posting } from "@/interfaces/models/entities/posting";

  import { PostingImages } from "@/interfaces/models/gallery";
  import { Description } from "@/interfaces/models/description";

  defineEmits([...useDialogPluginComponent.emits]);

  const INPUT_PANE_WIDTH = 480;

  const splitterModel = ref(INPUT_PANE_WIDTH);

  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const previewData = ref<Posting>({} as Posting);
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
    console.log("");
    // eventBus.on("CloseDilaog", () => {
    //   isDialogVisible.value = false;
    // });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    // eventBus.emit("DialogStatus", status, true);
  }
</script>
