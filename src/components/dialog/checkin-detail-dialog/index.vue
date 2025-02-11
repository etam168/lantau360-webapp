<template>
  <q-dialog
    ref="dialogRef"
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
            <check-in-detail-content :item />
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
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";

  // Custom Components
  import CheckInDetailContent from "./checkin-detail-content.vue";

  import { useBaseDialog } from "@/composable/use-base-dialog";

  // Emit
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { item } = defineProps<{
    item: CheckInView;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });
  const { translate } = useUtilities(locale.value);

  // Use the base dialog composition
  const { dialogRef, isDialogVisible, errorMessage, updateDialogState } =
    useBaseDialog();

  const dialogTitle = computed(() => {
    return translate(item.siteData!.siteName, item.siteData?.meta, "siteName");
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
