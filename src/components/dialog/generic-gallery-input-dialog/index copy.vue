<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card class="bg-white">
      <q-layout view="hHh lpR fFf">
        <app-dialog-bar :barTitle="$t(`${entityName}.dialog.create`)" />
        <q-page-container>
          <!-- Suspense wrapper for async component loading -->
          <Suspense>
            <template #default>
              <!-- Main input dialog content -->
              <input-dialog-content
                :entity-key
                :initializationData
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
            <p>{{ $t("common.contactAdminMessage") }}</p>
          </div>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  //Types
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  // Composables Imports
  import { useDialogPluginComponent } from "quasar";

  // Components
  import InputDialogContent from "./input-dialog-content.vue";
  import { EntityURLKey } from "@/constants/app/entity-url";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { entityKey, previewComponent, initializationData } = defineProps<{
    entityKey: EntityURLKey;
    previewComponent?: Component;
    initializationData?: CategoryTypes;
  }>();

  // Composable function calls
  const { eventBus, getEntityName } = useUtilities();
  const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

  // Reactive variables
  const isDialogVisible = ref(true);
  const errorMessage = ref<string | null>(null);
  const entityName = getEntityName(entityKey);

  /**
   * Handles the closing of the dialog
   * Sets visibility to false and triggers the cancel action after a delay
   */
  function handleCloseDialog(): void {
    // isDialogVisible.value = false;
    setTimeout(() => {
      try {
        // onDialogCancel();
        onDialogOK();
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
