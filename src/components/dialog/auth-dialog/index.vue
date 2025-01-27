<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout
      view="lHh lpr lFf"
      container
      :class="{ 'bg-secondary': $q.screen.lt.sm }"
      style="max-width: 640px"
    >
      <q-header v-if="$q.screen.lt.sm" bordered class="bg-transparent text-dark">
        <app-toolbar-dialog-title @close-dialog="handleCloseDialog" />
      </q-header>

      <q-page-container>
        <q-page class="column items-center justify-center">
          <auth-content :mode @close-dialog="handleCloseDialog" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import type { AuthMode } from "@/interfaces/types/auth-mode";

  // Custom Components
  import AuthContent from "./auth-content.vue";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { mode = "login" } = defineProps<{
    mode?: AuthMode;
  }>();

  // Composable function calls
  // Use the base dialog composition
  const { dialogRef, isDialogVisible, errorMessage, handleCloseDialog, updateDialogState } =
    useBaseDialog();

  /**
   * Error handling for the component
   * Captures errors and sets an appropriate error message
   */
  onErrorCaptured((e: unknown): boolean => {
    if (e instanceof Error) {
      errorMessage.value = e.message;
    } else if (typeof e === "string") {
      errorMessage.value = e;
    } else {
      errorMessage.value = "An unknown error occurred";
    }
    return true;
  });
</script>
