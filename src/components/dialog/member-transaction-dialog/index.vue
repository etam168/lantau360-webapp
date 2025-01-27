<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
    persistent
  >
    <q-layout view="lHh lpr lFr" class="bg-white" container style="max-width: 1024px">
      <q-header bordered class="bg-transparent text-dark">
        <app-dialog-title @dialog-closed="handleCloseDialog">{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <!-- Suspense wrapper for async component loading -->
        <Suspense>
          <template #default>
            <!-- Main edit dialog content -->
            <member-transaction-content :member />
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
  // Interface files
  import type { Member } from "@/interfaces/models/entities/member";

  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  // Components
  import MemberTransactionContent from "./member-transaction-content.vue";

  //Composable
  import { useBaseDialog } from "@/composable/use-base-dialog";

  import i18n from "@/plugins/i18n/i18n";

  // Emits definition
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { member } = defineProps<{
    member: Member;
  }>();

  // Composable function calls
  const { t } = i18n.global;

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
  const i18nKeyMoreDialog = "more.mainMenuDialog";

  const dialogTitle = computed(() => {
    return t(`${i18nKeyMoreDialog}.account.title`);
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
