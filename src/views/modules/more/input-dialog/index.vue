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
        <app-dialog-bar :barTitle="$t('business.dialoge.create')" />

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
                <editor />
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
  import { PropType, ref, provide, onMounted } from "vue";

  // 3rd Party Import
  import { useDialogPluginComponent } from "quasar";

  // .ts files
  import eventBus from "@/utils/event-bus";
  import { INPUT_PANE_WIDTH } from "@/constants";

  // Custom Components
  import AppDialogBar from "@/components/dialogs/app-dialog-bar.vue";
  import InputStep from "./input-step.vue";
  import Editor from "../shared/editor/index.vue";

  import { BusinessInput } from "@/interfaces/input/business-input";
  import { BusinessImages } from "@/interfaces/models/gallery";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { useBusinessInput } from "../shared/use-business-input";

  const { businessDescritiion } = useBusinessInput();

  defineEmits([...useDialogPluginComponent.emits]);

  const splitterModel = ref(INPUT_PANE_WIDTH);

  const props = defineProps({
    directoryList: {
      type: Array as PropType<Directory[]>
    }
  });

  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const previewData = ref<BusinessInput>({} as BusinessInput);
  const businessImages = ref<BusinessImages>({} as BusinessImages);

  provide("directoryList", props.directoryList);

  provide("images", businessImages);
  provide("previewData", previewData);
  provide("description", businessDescritiion);

  const closeDialog = () => {
    setTimeout(() => {
      onDialogCancel();
    }, 1200);
  };

  onMounted(() => {
    eventBus.on("CloseDilaog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, true);
  }
</script>
