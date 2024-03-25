<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="info" />
        <span class="q-ml-sm">{{ $t("community.alertDialog.alertText") }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('action.close')" color="primary" @click="handleOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";

  // .ts files

  import { useUtilities } from "@/composable/use-utilities";

  const { eventBus } = useUtilities();
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  onMounted(() => {
    eventBus.on("AlertDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "AlertDialog");
  }

  function handleOk() {
    onDialogCancel();
    setTimeout(() => {
      eventBus.emit("navigateToMore");
    }, 1200);
  }
</script>
