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
      <!-- <app-dialog-bar :barTitle="$t(`${entityName}.dialog.edit`)" /> -->
      <q-header bordered class="bg-transparent text-dark">
        <app-dialog-title @dialog-closed="handleDialogClose">{{ contentName }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <!-- Suspense wrapper for async component loading -->
        <Suspense>
          <template #default>
            <!-- Main more-detail content -->
            <more-detail-content
              :contentName
              v-model:is-loading="tempLoading"
              @update:is-loading="handleLoadingChange"
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
  </q-dialog>
</template>

<script setup lang="ts">
  // Composables Imports
  import { useDialogPluginComponent } from "quasar";

  // Components
  import MoreDetailContent from "./more-detail-content.vue";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { contentName, isLoading } = defineProps<{
    contentName: string;
    isLoading: Ref<boolean>;
  }>();

  const tempLoading = ref(isLoading.value);

  // Composable function calls
  const { dialogRef, onDialogOK } = useDialogPluginComponent();

  // Reactive variables
  const isDialogVisible = ref(true);
  const errorMessage = ref<string | null>(null);

  function handleLoadingChange() {
    // alert("isLoading: " + tempLoading.value);
    isLoading.value = tempLoading.value;
  }

  /**
   * Updates the dialog's visibility state
   * @param status - The new visibility state
   */
  function updateDialogState(status: boolean): void {
    isDialogVisible.value = status;
  }

  function handleDialogClose() {
    onDialogOK();
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
    // eventBus.on("dialogClosed", () => {
    //   alert("closedialogevent");
    //   isDialogVisible.value = false;
    // });
  });
</script>
