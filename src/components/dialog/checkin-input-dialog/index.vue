<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    @hide="onDialogHide"
    @update:model-value="updateDialogState"
    maximized
  >
    <q-layout view="lHh lpr lFr" class="bg-white" container style="max-width: 1024px">
      <q-header bordered class="bg-transparent text-dark">
        <app-dialog-title>
          {{ $t(`${entityName}.dialog.create`) }}
        </app-dialog-title>
      </q-header>

      <q-page-container>
        <!-- Suspense wrapper for async component loading -->
        <Suspense>
          <template #default>
            <!-- Main input dialog content -->
            <checkin-input-content :entity-key :site @close-dialog="handleCloseDialog" />
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
  import CheckinInputContent from "./checkin-input-content.vue";

  // Constants
  import { EntityURLKey } from "@/constants";

  import { useBaseDialog } from "@/composable/use-base-dialog";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { entityKey, site } = defineProps<{
    entityKey: EntityURLKey;
    site?: SiteView;
  }>();

  // Composable function calls
  const { getEntityName } = useUtilities();

  // Use the base dialog composition
  const {
    dialogRef,
    onDialogHide,
    isDialogVisible,
    errorMessage,
    updateDialogState
  } = useBaseDialog();

  // Reactive variables
  const entityName = getEntityName(entityKey);

  function handleCloseDialog() {
    dialogRef?.value?.hide();
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
</script>
