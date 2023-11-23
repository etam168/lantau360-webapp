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
    <q-card class="bg-grey-2">
      <q-layout view="hHh lpR fFf">
        <app-dialog-bar :barTitle="$t('business.dialoge.edit')" />
        <q-page-container>
          <q-card class="bg-transparent">
            <q-splitter
              v-model="splitterModel"
              unit="px"
              :limits="[INPUT_PANE_WIDTH, INPUT_PANE_WIDTH]"
              class="bg-transparent"
              style="height: calc(100vh - 32px)"
              v-if="$q.screen.gt.sm"
            >
              <template v-slot:before>
                <input-step
                  :row="rowData"
                  @close-dialog="closeDialog"
                  :directoryList="directoryList"
                />
              </template>

              <template v-slot:after>
                <editor :row="rowData" />
              </template>
            </q-splitter>
          </q-card>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, ref, provide, watchEffect, onMounted } from "vue";

  // 3rd Party Import
  import { useDialogPluginComponent } from "quasar";

  // .ts files
  import eventBus from "@/utils/event-bus";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { INPUT_PANE_WIDTH } from "@/constants";

  // Custom Components
  import AppDialogBar from "@/components/dialogs/app-dialog-bar.vue";
  import InputStep from "./input-step.vue";

  import { BusinessImages } from "@/interfaces/models/gallery";
  import { BusinessDatatable } from "@/interfaces/datatable/business-datatable";
  import Editor from "../shared/editor/index.vue";
  import { useBusinessInput } from "../shared/use-business-input";

  const { businessDescritiion } = useBusinessInput();

  defineEmits([...useDialogPluginComponent.emits]);

  const splitterModel = ref(INPUT_PANE_WIDTH);

  const props = defineProps({
    row: {
      type: Object as PropType<BusinessDatatable>,
      required: true
    },
    directoryList: {
      type: Array as PropType<Directory[]>
    }
  });

  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

  const isDialogVisible = ref();
  // Create a reactive copy of the row object
  const rowData = ref({ ...props.row });

  // Watch for changes in the original row object and update the copy
  watchEffect(() => {
    rowData.value = { ...props.row };
  });
  const previewData = ref<BusinessDatatable>({} as BusinessDatatable);
  const businessImages = ref<BusinessImages>({} as BusinessImages);

  provide("images", businessImages);
  provide("previewData", previewData);
  provide("description", businessDescritiion);

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, true);
  }

  onMounted(() => {
    eventBus.on("CloseDilaog", () => {
      isDialogVisible.value = false;
    });
  });

  const closeDialog = () => {
    setTimeout(() => {
      onDialogCancel();
    }, 1200);
  };
</script>
