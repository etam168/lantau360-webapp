<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFr" class="bg-white" container style="max-width: 1024px">
      <!-- <app-dialog-bar :barTitle="$t(`${entityName}.dialog.edit`)" /> -->
      <q-header bordered class="bg-transparent text-dark">
        <app-dialog-title>Dialog</app-dialog-title>
      </q-header>

      <q-page-container>
        <!-- Main more-detail content -->
        <install-items-content />

        <!-- Error message display -->
        <div v-if="errorMessage" class="q-pa-md bg-negative text-white">
          {{ errorMessage }}
        </div>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  // Components
  import InstallItemsContent from "./install-items-content.vue";

  //Composable
  import { useBaseDialog } from "@/composable/use-base-dialog";

  // Emits definition
  defineEmits([...useDialogPluginComponent.emits]);

  // Use the base dialog composition
  const { dialogRef, isDialogVisible, errorMessage, updateDialogState } = useBaseDialog();
</script>
