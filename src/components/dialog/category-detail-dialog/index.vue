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
      <app-dialog-title >{{ dialogTitle }}</app-dialog-title>

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
  // Types
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Quasar  Imports
  import { useDialogPluginComponent } from "quasar";

  // Custom Components
  import CategoryDetailContent from "./category-detail-content.vue";
  import { useBaseDialog } from "@/composable/use-base-dialog";

  // Emits definition
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { category, entityKey, displayMask } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    displayMask?: number;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });
  const { translate, getEntityName } = useUtilities(locale.value);

  // Use the base dialog composition
  const {
    dialogRef,
    onDialogHide,
    isDialogVisible,
    errorMessage,
    updateDialogState
  } = useBaseDialog();

  const entityName = getEntityName(entityKey);

  const dialogTitle = computed(() => {
    const nameKey = `${entityName}Name` as keyof CategoryTypes;
    return translate(category[nameKey] as string, category.meta, nameKey);
  });

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
