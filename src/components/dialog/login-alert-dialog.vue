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
  const { dialogRef } = useDialogPluginComponent();

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

  onMounted(() => {
    const timeout = Math.random() * 100000; // random timeout up to 100 seconds
    setTimeout(() => {
      if (isDialogVisible.value) {
        isDialogVisible.value = false; // Close the dialog after the timeout
      }
    }, timeout);
  });
</script>
