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
    <q-card class="bg-white">
      <q-layout view="hHh lpR fFf">
        <app-dialog-bar :barTitle="$t('member.dialoge.edit')" />

        <q-page-container>
          <q-card class="bg-transparent">
            <q-splitter
              v-if="$q.screen.gt.sm"
              v-model="splitterModel"
              unit="px"
              :limits="[INPUT_PANE_WIDTH, INPUT_PANE_WIDTH]"
              style="height: calc(100vh - 32px)"
            >
              <template v-slot:before>
                <input-steps
                  @on-save="onSave"
                  @on-dialog-cancel="onDialogCancel"
                  :row="props.row"
                />
              </template>

              <template v-slot:after>
                <preview-pane />
              </template>
            </q-splitter>

            <q-card-section v-else style="height: calc(100vh - 32px)">
              <input-steps @on-save="onSave" @on-dialog-cancel="onDialogCancel" :row="row" />
            </q-card-section>
          </q-card>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  // Vue Import
  import { onMounted, PropType, ref, provide } from "vue";

  // 3rd Party Import
  import { useDialogPluginComponent } from "quasar";

  // .ts files
  import { INPUT_PANE_WIDTH } from "@/constants";
  import eventBus from "@/utils/event-bus";
  import { MemberDatatable } from "@/interfaces/datatable/member-datatable";

  // Custom Components
  import AppDialogBar from "@/components/dialogs/app-dialog-bar.vue";
  import InputSteps from "./input-steps.vue";
  import PreviewPane from "../shared/preview-pane/index.vue";

  defineEmits([...useDialogPluginComponent.emits]);

  const splitterModel = ref(INPUT_PANE_WIDTH);

  const props = defineProps({
    row: {
      type: Object as PropType<MemberDatatable>,
      required: true
    }
  });

  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const previewMember = ref<MemberDatatable>({} as MemberDatatable);
  //const imagePath = ref<any>(props.row.imagePath);

  provide("previewMember", previewMember);
  //provide("imagePath", imagePath);

  const onSave = () => {
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
    eventBus.emit("DialogStatus", status);
  }
</script>
