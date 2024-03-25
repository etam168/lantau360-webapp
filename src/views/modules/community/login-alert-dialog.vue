<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card>
      <q-bar class="bg-primary">
        <q-space />

        <q-btn dense icon="close" color="red" v-close-popup size="xs">
          <q-tooltip>{{ $t("action.close") }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-md">
        <div class="text-h6">{{ $t("community.loginDialog.question") }}</div>
        <div class="text-subtitle2 text-weight-regular">
          {{ $t("community.loginDialog.subtitle") }}
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn outline label="Cancel" color="primary" v-close-popup />
        <q-btn :label="$t('auth.login.button')" color="primary" @click="handleOk" />
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
    eventBus.on("LoginAlertDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "LoginAlertDialog");
  }

  function handleOk() {
    onDialogCancel();
    setTimeout(() => {
      eventBus.emit("navigateToMore");
    }, 1200);
  }
</script>
