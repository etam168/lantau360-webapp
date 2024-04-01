<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ "CheckIn" }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <h2>CheckIn Page</h2>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { ref } from "vue";

  // Custom Components

  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
</script>
