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
            <category-items-content :directory :entityKey :dialogName :sortByKey />
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

  // Stores
  import { useOpenDialogStore } from "@/stores/open-dialog-store";

  // Quasar Import
  import { EventBus, useDialogPluginComponent } from "quasar";

  // Custom Components
  import CategoryItemsContent from "./category-items-content.vue";

  // Constants
  import { EntityURLKey, TEMPLATE } from "@/constants";

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Props
  const {
    directory,
    entityKey,
    dialogName = "ItemListDialog",
    i18nKey
  } = defineProps<{
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    dialogName: string;
    i18nKey: string;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });
  const { eventBus, translate } = useUtilities(locale.value);
  const { dialogRef, onDialogHide } = useDialogPluginComponent();
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
        return false;
      case TEMPLATE.TIMETABLE.value:
        return false;
      case TEMPLATE.EMERGENCY.value:
        return false;
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

  // Lifecycle hooks
  onMounted(() => {
    alert("onMounted: category");
    // Set up event listener for closing dialog
    console.log("Category Items");
    debugger;
    console.log(dialogRef.value?.$el); // See all available properties
    const dialogId = dialogRef.value?.$el.parentElement.id;
    const dialogContainer = document.getElementById(dialogId);
    console.log("dialogContainer ");

    const currentQuery = new URLSearchParams(window.location.search);
    currentQuery.set("dialog", dialogId);

    const newUrl = `${window.location.pathname}?${currentQuery.toString()}`;
    history.replaceState(null, "", newUrl); ///To do

    openDialogStore.updateQuery(dialogId);

    // Add event listener for DialogClose
    bus.on("DialogClose", () => {
      alert("DialogClose");
      // handleCloseDialog();
    });
  });

  onUnmounted(() => {
    alert("onUnmounted: category");
    bus.off("DialogClose");
  });
</script>
