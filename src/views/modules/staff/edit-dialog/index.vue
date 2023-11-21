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
        <app-dialog-bar :barTitle="$t('staff.dialoge.edit')" />

        <q-page-container>
          <q-card class="bg-transparent" flat>
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
                <input-steps :row="row" @on-dialog-cancel="onDialogCancel" />
              </template>
            </q-splitter>
            <q-card-section v-else style="height: calc(100vh - 32px)">
              <input-steps :row="row" @on-dialog-cancel="onDialogCancel" />
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
  import { PropType, onMounted, ref, provide } from "vue";

  // 3rd Party Import
  import { useDialogPluginComponent } from "quasar";

  // .ts files
  import { StaffDatatable } from "@/interfaces/datatable/staff-datatable";
  import eventBus from "@/utils/event-bus";
  import { StaffRole } from "@/interfaces/staffRole";
  import { INPUT_PANE_WIDTH } from "@/constants";

  // Custom Components
  import AppDialogBar from "@/components/dialogs/app-dialog-bar.vue";
  import InputSteps from "./input-steps.vue";

  defineEmits([...useDialogPluginComponent.emits, "on-dialog-cancel"]);

  const props = defineProps({
    roles: {
      type: Object as PropType<StaffRole[]>
    },
    row: {
      type: Object as PropType<StaffDatatable>,
      required: true
    }
  });

  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const splitterModel = ref(INPUT_PANE_WIDTH);

  // Provide only the staffInput to the child component
  provide("staffRoles", props.roles);

  onMounted(() => {
    eventBus.on("CloseDilaog", () => {
      isDialogVisible.value = false;
    });
  });

  const updateDialogState = (status: any) => {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status);
  };
</script>
