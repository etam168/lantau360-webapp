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
  // Composables Imports
  import { useDialogPluginComponent } from "quasar";

  import { fasTriangleExclamation } from "@quasar/extras/fontawesome-v6";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Reactive variables
  const $q = useQuasar();
  const isDialogVisible = ref(true);
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();

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
