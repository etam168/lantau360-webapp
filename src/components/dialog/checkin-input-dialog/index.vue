<template>
  <q-dialog
    maximized
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    @hide="onDialogHide"
    @update:model-value="updateDialogState"
  >
    <q-layout view="lHh lpr lFr" class="bg-white" container style="max-width: 1024px">
      <q-header bordered class="bg-transparent text-dark">
        <app-dialog-title>
          {{ dialogName ? $t(`more.${dialogName}`) : $t(`${entityName}.dialog.create`) }}
        </app-dialog-title>
      </q-header>

      <q-page-container>
        <!-- Suspense wrapper for async component loading -->
        <Suspense>
          <template #default>
            <!-- Main input dialog content -->
            <input-dialog-content :entity-key :site @close-dialog="handleCloseDialog" />
          </template>

          <template #fallback>
            <!-- Loading spinner shown while content is loading -->
            <div class="row justify-center items-center" style="height: 500px">
              <app-spinner size="10em" />
            </div>
          </template>
        </Suspense>
        <!-- Error message display -->
        <div v-if="errorMessage" class="q-pa-md bg-negative text-white">
          {{ errorMessage }}
        </div>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  // Components
  import InputDialogContent from "./input-dialog-content.vue";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { entityKey, site } = defineProps<{
    entityKey: EntityURLKey;
    site?: SiteView;
    dialogName?: string;
  }>();

  // Composable function calls
  const { eventBus, getEntityName } = useUtilities();
  const { dialogRef, onDialogCancel, onDialogHide } = useDialogPluginComponent();

  // Reactive variables
  const isDialogVisible = ref(true);
  const errorMessage = ref<string | null>(null);
  const entityName = getEntityName(entityKey);

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
    eventBus("CloseDialog").on(() => {
      isDialogVisible.value = false;
    });
  });
</script>
