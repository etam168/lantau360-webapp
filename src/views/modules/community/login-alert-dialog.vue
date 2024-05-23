<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title />
      </q-header>

      <q-page-container>
        <q-page>
          <q-card
            flat
            class="column justify-center items-center"
            style="min-height: calc(100vh - 50px)"
          >
            <q-card-section :style="$q.screen.gt.xs ? 'width: 300px' : 'width : 100%'">
              <div class="text-h6 text-center">{{ $t("community.loginDialog.question") }}</div>
              <div class="text-subtitle2 text-weight-regular text-center">
                {{ $t("community.loginDialog.subtitle") }}
              </div>
            </q-card-section>

            <q-card-actions class="q-px-none no-wrap">
              <q-btn outline label="Cancel" color="primary" v-close-popup />
              <q-btn :label="$t('auth.login.button')" color="primary" @click="handleOk" />
            </q-card-actions>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
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
