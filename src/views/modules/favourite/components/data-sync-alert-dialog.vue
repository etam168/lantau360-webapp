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
        <span class="q-ml-sm">Your data is not sync. Which data you would prefer to sync</span>
      </q-card-section>

      <q-card-actions align="right">
        <!-- <q-btn flat label="Cancel" color="primary" v-close-popup /> -->
        <q-btn flat label="Local Data" color="primary" v-close-popup @click="updateData('local')" />
        <q-btn
          flat
          label="Server Data"
          color="primary"
          v-close-popup
          @click="updateData('server')"
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
  const { dialogRef, onDialogOK } = useDialogPluginComponent();

  function updateDialogState(status: boolean): void {
    isDialogVisible.value = status;
  }

  const updateData = (value: any) => {
    onDialogOK(value);
  };

  // Lifecycle hooks
  onMounted(() => {
    const timeout = Math.random() * 100000; // random timeout up to 100 seconds
    setTimeout(() => {
      if (isDialogVisible.value) {
        isDialogVisible.value = false; // Close the dialog after the timeout
      }
    }, timeout);
  });
</script>
