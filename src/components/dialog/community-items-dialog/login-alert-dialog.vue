<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card>
      <q-card-section>
        <q-avatar :icon="fasTriangleExclamation" color="primary" text-color="white" />
        <span class="q-ml-sm">Please login first to check in.</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Login" color="primary" v-close-popup @click="onLogin" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  // Third party import
  import { fasTriangleExclamation } from "@quasar/extras/fontawesome-v6";

  // Emit
  defineEmits([...useDialogPluginComponent.emits]);

  // Composable function calls
  const $q = useQuasar();
  const { dialogRef } = useDialogPluginComponent();

  // Reactive variables
  const isDialogVisible = ref(true);

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
