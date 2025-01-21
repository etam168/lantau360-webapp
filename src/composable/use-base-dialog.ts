// composables/useBaseDialog.ts
import { ref, onMounted, onUnmounted, inject } from "vue";
import { useDialogPluginComponent, EventBus } from "quasar";
import { useOpenDialogStore } from "@/stores/open-dialog-store";

export function useBaseDialog() {
  const isDialogVisible = ref(true);
  const errorMessage = ref<string | null>(null);
  const dialogId = ref<string>("");

  // Get dialogRef and other utilities from Quasar's dialog plugin
  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const openDialogStore = useOpenDialogStore();
  const bus = inject("bus") as EventBus;

  function handleCloseDialog(): void {
    setTimeout(() => {
      try {
        openDialogStore.removeDialogFromQuery(dialogId.value);
        openDialogStore.updateWindowHistory();
        isDialogVisible.value = false;
      } catch (error) {
        console.error("Error while closing dialog:", error);
      }
    }, 1200);
  }

  function updateDialogState(status: boolean): void {
    isDialogVisible.value = status;
  }

  const handleDialogClose = (receivedDialogId: string) => {
    if (receivedDialogId === dialogId.value) {
      handleCloseDialog();
    }
  };

  onMounted(() => {
    // Now dialogRef comes from Quasar's plugin
    dialogId.value = dialogRef.value?.$el.parentElement.id;
    openDialogStore.updateQuery(dialogId.value);
    openDialogStore.updateWindowHistory();
    bus.on("DialogClose", handleDialogClose);
  });

  onUnmounted(() => {
    bus.off("DialogClose", handleDialogClose);
  });

  return {
    dialogRef, // This now comes from Quasar's plugin
    onDialogHide,
    isDialogVisible,
    errorMessage,
    dialogId,
    handleCloseDialog,
    updateDialogState
  };
}
