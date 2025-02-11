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
      <q-header bordered class="bg-transparent text-dark">
        <app-dialog-title >{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <!-- Suspense wrapper for async component loading -->
        <Suspense>
          <template #default>
            <!-- Main community items dialog content -->
            <community-items-content :directory :entityKey :style="tableStyle" class="q-mt-xs" />
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

  // Interface files
  import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

  // Custom Components
  import CommunityItemsContent from "./community-items-content.vue";

  // Constants
  import { EntityURLKey } from "@/constants/app/entity-url";

  //Composable
  import { useBaseDialog } from "@/composable/use-base-dialog";

  // Emits definition
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { directory, entityKey } = defineProps<{
    directory: CommunityDirectory;
    entityKey: EntityURLKey;
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
    updateDialogState
  } = useBaseDialog();

  const THRESHOLD = 100;

  const dialogTitle = computed(() =>
    translate(directory.directoryName, directory.meta, "directoryName")
  );

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const dialogTitleHeight = 50 + 5;
    const usedHeight = dialogTitleHeight;

    const hasEnoughSpace = $q.screen.height > THRESHOLD;

    switch (true) {
      case hasEnoughSpace:
        return { height: `calc(100vh - ${usedHeight}px)` };
      default:
        return undefined;
    }
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
