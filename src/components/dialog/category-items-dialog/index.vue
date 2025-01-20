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
            <category-items-content :directory :entityKey :sortByKey />
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

  // Stores
  import { useOpenDialogStore } from "@/stores/open-dialog-store";

  // Quasar Import
  import { EventBus, useDialogPluginComponent } from "quasar";

  // Custom Components
  import CategoryItemsContent from "./category-items-content.vue";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const { directory, entityKey, i18nKey } = defineProps<{
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    i18nKey: string;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });
  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const { translate } = useUtilities(locale.value);

  const openDialogStore = useOpenDialogStore();

  // Reactive variables
  const isDialogVisible = ref(true);
  const errorMessage = ref<string | null>(null);
  const sortByKey = ref("default");

  const dialogTitle = computed(() =>
    translate(directory.directoryName, directory.meta, "directoryName")
  );

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
   * Handles the sorting
   */
  const handleChangeSortOptions = (sortBy: string) => {
    sortByKey.value = sortBy;
  };

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

  const bus = inject("bus") as EventBus;
  const dialogId = ref<string>("");

  // Store the event handler function in a variable so we can reference it in both mounted and unmounted
  const handleDialogClose = (receivedDialogId: string) => {
    alert("handle Items DialogClose: " + receivedDialogId);
    if (receivedDialogId === dialogId.value) {
      alert("id matched");
      handleCloseDialog();
    }
  };

  onMounted(() => {
    alert("onMounted: category");
    // Get the DOM id from the dialogRef
    dialogId.value = dialogRef.value?.$el.parentElement.id;

    // Update store query param and the browser address bar
    openDialogStore.updateQuery(dialogId.value);
    openDialogStore.updateWindowHistory();

    // Add event listener for DialogClose with dialogId parameter
    bus.on("DialogClose", handleDialogClose);
  });

  onUnmounted(() => {
    alert("onUnmounted: category");
    // bus.off("DialogClose"); // Remove only this specific listener
    bus.off("DialogClose", handleDialogClose); // Remove only this specific listener
  });
</script>
