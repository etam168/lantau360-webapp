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
    <q-layout view="lHh lpr lFr" class="bg-white" style="max-width: 1024px">
      <app-dialog-title @dialog-closed="handleCloseDialog">{{ dialogTitle }}</app-dialog-title>

      <q-page-container>
        <!-- Suspense wrapper for async component loading -->
        <Suspense>
          <template #default>
            <category-detail-content :category :entity-key :displayMask />
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
  // Quasar  Imports
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Custom Components
  import CategoryDetailContent from "./category-detail-content.vue";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Emits definition
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const {
    category,
    entityKey,
    dialogName = "Detail",
    displayMask
  } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    dialogName: string;
    displayMask?: number;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });

  const { eventBus, translate, getEntityName } = useUtilities(locale.value);
  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  // Reactive variables
  const isDialogVisible = ref(true);
  const errorMessage = ref<string | null>(null);
  const entityName = getEntityName(entityKey);

  const dialogTitle = computed(() => {
    const nameKey = `${entityName}Name` as keyof CategoryTypes;
    return translate(category[nameKey] as string, category.meta, nameKey);
  });

  /**
   * Handles the closing of the dialog
   * Sets visibility to false and triggers the cancel action after a delay
   */
  function handleCloseDialog(): void {
    eventBus("DialogStatus").emit(false, dialogName);
    setTimeout(() => {
      try {
        isDialogVisible.value = false;
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
