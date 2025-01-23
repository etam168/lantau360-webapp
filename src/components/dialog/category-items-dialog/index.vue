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
      <app-dialog-title
        :i18n-key
        :has-options
        @dialog-closed="handleCloseDialog"
        @change:sort-option="handleChangeSortOptions"
        >{{ dialogTitle }}
      </app-dialog-title>

      <q-page-container>
        <!-- Suspense wrapper for async component loading -->
        <Suspense>
          <template #default>
            <!-- Main edit dialog content -->
            <category-items-content
              :directory
              :entityKey
              :sortByKey
              :style="tableStyle"
              class="q-mt-xs"
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
  // Types
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";

  // Constants
  import { EntityURLKey, TEMPLATE } from "@/constants";

  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  // Custom Components
  import CategoryItemsContent from "./category-items-content.vue";

  //Composable
  import { useBaseDialog } from "@/composable/use-base-dialog";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { directory, entityKey, i18nKey } = defineProps<{
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    i18nKey: string;
  }>();

  // Composable function calls
  const $q = useQuasar();
  const { locale } = useI18n({ useScope: "global" });
  const { translate } = useUtilities(locale.value);

  // Use the base dialog composition
  const {
    dialogRef,
    onDialogHide,
    isDialogVisible,
    errorMessage,
    handleCloseDialog,
    updateDialogState
  } = useBaseDialog();

  // Reactive variables
  const sortByKey = ref("default");
  const THRESHOLD = 100;

  const dialogTitle = computed(() =>
    translate(directory.directoryName, directory.meta, "directoryName")
  );

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const dialogTitleHeight = 50 + 4;
    const usedHeight = dialogTitleHeight;

    const hasEnoughSpace = $q.screen.height > THRESHOLD;

    switch (true) {
      case hasEnoughSpace:
        return { height: `calc(100vh - ${usedHeight}px)` };
      default:
        return undefined;
    }
  });

  const hasOptions = computed(() => {
    const directoryTemplate = directory.meta.template ?? 0;
    switch (directoryTemplate) {
      case TEMPLATE.TAXI.value:
      case TEMPLATE.TIMETABLE.value:
      case TEMPLATE.EMERGENCY.value:
      case TEMPLATE.DAYTRIP.value:
        return false;
      default:
        return true;
    }
  });

  /**
   * Handles the sorting
   */
  const handleChangeSortOptions = (sortBy: string) => {
    sortByKey.value = sortBy;
  };

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
