<template>
  <q-dialog
    maximized
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    @hide="onDialogHide"
    @update:model-value="updateDialogState"
    persistent
  >
    <q-layout view="lHh lpr lFr" class="bg-white" container style="max-width: 1024px">
      <q-header bordered class="bg-transparent text-dark">
        <!-- <app-dialog-title>{{ $t(`${entityName}.dialog.edit`) }}</app-dialog-title> -->

        <app-dialog-title>
          {{
            dialogName
              ? $t(`${i18nKeyMoreDialog}.${dialogName}.title`)
              : $t(`${entityName}.dialog.edit`)
          }}
        </app-dialog-title>
      </q-header>

      <q-page-container>
        <!-- Suspense wrapper for async component loading -->
        <Suspense>
          <template #default>
            <!-- Main edit dialog content -->
            <edit-dialog-content :row :entity-key @close-dialog="handleCloseDialog" />
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
  // Type imports
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Composables Imports
  import { useDialogPluginComponent } from "quasar";

  // Components
  import EditDialogContent from "./edit-dialog-content.vue";
  import { EntityURLKey } from "@/constants/app/entity-url";

  //Composable
  import { useBaseDialog } from "@/composable/use-base-dialog";

  // Emit
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const {
    row,
    entityKey,
    dialogName = ""
  } = defineProps<{
    row: CategoryTypes;
    entityKey: EntityURLKey;
    dialogName?: string;
  }>();

  // Composable function calls
  const { getEntityName } = useUtilities();

  // Reactive variables
  const entityName = getEntityName(entityKey);
  const i18nKeyMoreDialog = "more.mainMenuDialog";

  // Use the base dialog composition
  const {
    dialogRef,
    onDialogHide,
    isDialogVisible,
    errorMessage,
    handleCloseDialog,
    updateDialogState
  } = useBaseDialog();

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
