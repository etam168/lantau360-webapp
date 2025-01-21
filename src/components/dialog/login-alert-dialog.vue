<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    persistent
  >
    <q-card>
      <q-card-section>
        <q-avatar :icon="fasTriangleExclamation" color="negative" text-color="white" />
        <span class="q-ml-sm">{{ $t(`${i18nKey}.label.loginToProceed`) }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <app-button flat :label="$t('action.cancel')" color="primary" v-close-popup />
        <app-button
          flat
          :label="$t(`${i18nKey}.button.login`)"
          color="primary"
          v-close-popup
          @click="onLogin"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  // Third party imports
  import { fasTriangleExclamation } from "@quasar/extras/fontawesome-v6";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Reactive variables
  const $q = useQuasar();
  const isDialogVisible = ref(true);
  const { dialogRef } = useDialogPluginComponent();

  const i18nKey = "auth";

  function updateDialogState(status: boolean): void {
    isDialogVisible.value = status;
  }

  const onLogin = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/auth-dialog/index.vue")),
      componentProps: {
        mode: "login"
      }
    });
  };
</script>
