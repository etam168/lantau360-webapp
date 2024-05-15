<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card class="q-pa-md">
      <q-card-section class="text-center">
        <q-icon name="report_problem" size="4rem" color="primary" />
        <div class="text-h6">Top up points</div>
        <div class="text-body2 q-mt-sm">
          User can gets two free top-up requests in a month. Your free top-up request of current has
          been completed. You can either wait until next month to ask for more free top-ups or
          purchase some now.
        </div>
      </q-card-section>

      <q-card-actions class="q-px-none no-wrap">
        <app-button
          class="full-width q-mx-xs"
          label="Cancel"
          color="red"
          type="submit"
          v-close-popup
        />

        <div class="q-mx-xs"></div>

        <app-button
          class="full-width"
          label="Purhcase"
          color="primary"
          type="submit"
          @click="handleOk"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";

  const { eventBus } = useUtilities();
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const props = defineProps({
    callback: {
      type: Function,
      required: true
    }
  });

  onMounted(() => {
    eventBus.on("ConfirmationDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "ConfirmationDialog");
  }

  function handleOk() {
    updateDialogState(false);
    props.callback(onDialogCancel);
  }
</script>
