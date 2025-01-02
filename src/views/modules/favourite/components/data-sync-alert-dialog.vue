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
        <span class="q-ml-sm">{{ $t(`${i18nKey}.dataSync`) }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <app-button
          flat
          :label="$t(`${i18nKey}.localData`)"
          color="primary"
          v-close-popup
          @click="updateData('local')"
        />

        <app-button
          flat
          :label="$t(`${i18nKey}.serverData`)"
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
  const isDialogVisible = ref(true);
  const { dialogRef, onDialogOK } = useDialogPluginComponent();

  const i18nKey = "favourite.dialog";

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
