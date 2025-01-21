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
          <!-- {{ dialogName ? $t(`more.${dialogName}`) : $t(`${entityName}.dialog.create`) }} -->
        </app-dialog-title>
      </q-header>

      <q-page-container>
        <!-- Suspense wrapper for async component loading -->
        <Suspense>
          <template #default>
            <!-- Main input dialog content -->
            <input-dialog-content
              :entity-key
              :associatedEntityId
              @close-dialog="handleCloseDialog"
            />
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
  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  // Components
  import InputDialogContent from "./input-dialog-content.vue";

  // Constants
  import { EntityURLKey } from "@/constants";

  //Composable
  import { useBaseDialog } from "@/composable/use-base-dialog";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { entityKey, associatedEntityId } = defineProps<{
    entityKey: EntityURLKey;
    associatedEntityId?: any;
  }>();

  // Composable function calls
  const { getEntityName } = useUtilities();

  // Use the base dialog composition
  const {
    dialogRef,
    onDialogHide,
    isDialogVisible,
    errorMessage,
    handleCloseDialog,
    updateDialogState
  } = useBaseDialog();

  const entityName = getEntityName(entityKey);

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
