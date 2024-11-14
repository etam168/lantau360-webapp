<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFr" class="bg-white" container style="max-width: 1024px">
      <!-- <q-header bordered class="bg-transparent text-dark"> -->
      <app-dialog-title @dialog-closed="handleCloseDialog">{{ dialogTitle }}</app-dialog-title>
      <!-- </q-header> -->

      <q-page-container>
        <!-- Suspense wrapper for async component loading -->
        <Suspense>
          <template #default>
            <!-- Main edit dialog content -->
            <category-detail-content :category :entity-key />
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
  </q-dialog>
</template>

<script setup lang="ts">
  // Type imports
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Composables Imports
  import { useDialogPluginComponent } from "quasar";

  // Components
  import CategoryDetailContent from "./category-detail-content.vue";
  // Constants
  import { EntityURLKey } from "@/constants/app/entity-url";

  // Emits definition
  defineEmits([...useDialogPluginComponent.emits]);
  // Props
  const {
    category,
    entityKey,
    dialogName = "Detail"
  } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    dialogName?: string;
  }>();

  // Composable function calls
  const { eventBus } = useUtilities();
  const { translate, getEntityName } = useUtilities();
  const { dialogRef, onDialogCancel, onDialogHide } = useDialogPluginComponent();
  // Reactive variables
  const isDialogVisible = ref(true);
  const errorMessage = ref<string | null>(null);
  const entityName = getEntityName(entityKey);

  const dialogTitle = computed(() => {
    const nameKey = `${entityName}Name` as keyof CategoryTypes; // Type assertion
    return translate(category[nameKey] as string, category.meta, nameKey);
  });

  /**
   * Handles the closing of the dialog
   * Sets visibility to false and triggers the cancel action after a delay
   */
  function handleCloseDialog(): void {
    isDialogVisible.value = false;
    eventBus("DialogStatus").emit(false, dialogName);
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
    eventBus(dialogName).on(() => {
      isDialogVisible.value = false;
    });
  });
</script>
