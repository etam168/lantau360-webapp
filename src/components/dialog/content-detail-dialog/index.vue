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
        <app-dialog-title>{{ category.title }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <Suspense>
          <template #default>
            <!-- <div>dialog</div> -->
            <!-- Main content dialog content -->
            <content-detail-content :category />
          </template>
          <template #fallback>
            <!-- Loading spinner shown while content is loading -->
            <div class="row justify-center items-center" style="height: 500px">
              <app-spinner size="10em" />
            </div>
          </template>
        </Suspense>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  // Composables Imports
  import { useDialogPluginComponent } from "quasar";

  import ContentDetailContent from "./content-detail-content.vue";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { category } = defineProps<{
    category: any;
  }>();

  // Composable function calls
  const { translate } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();

  // Reactive variables
  const isDialogVisible = ref(true);
  const errorMessage = ref<string | null>(null);

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
    // eventBus("CloseDialog").on(() => {
    //   isDialogVisible.value = false;
    // });
  });
</script>
