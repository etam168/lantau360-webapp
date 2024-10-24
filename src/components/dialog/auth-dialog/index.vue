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
        <app-toolbar-dialog-title />
      </q-header>

      <q-page-container>
        <q-page class="column items-center justify-center">
          <auth-content :mode />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import type { AuthMode } from "@/interfaces/types/auth-mode";

  // Composables Imports
  import { useDialogPluginComponent } from "quasar";

  // Components
  import AuthContent from "./auth-content.vue";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { mode = "login" } = defineProps<{
    mode?: AuthMode;
  }>();

  // Composable function calls
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();

  // Reactive variables
  const isDialogVisible = ref(true);
  const errorMessage = ref<string | null>(null);

  /**
   * Handles the closing of the dialog
   * Sets visibility to false and triggers the cancel action after a delay
   */
  function handleCloseDialog(): void {
    isDialogVisible.value = false;
    setTimeout(() => {
      try {
        onDialogCancel();
      } catch (error) {
        console.error("Error while closing dialog:", error);
      }
    }, 1200);
  }

  /**
   * Updates the dialog's visibility state
   * @param status - The new visibility state
   */
  function updateDialogState(status: boolean): void {
    isDialogVisible.value = status;
  }

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

  // Lifecycle hooks
  onMounted(() => {
    // Set up event listener for closing dialog
    // eventBus("CloseDialog").on(() => {
    //   isDialogVisible.value = false;
    // });
  });
</script>
