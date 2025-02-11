// composables/useBaseDialog.ts
import { useDialogPluginComponent } from "quasar";
import { useOpenDialogStore } from "@/stores/open-dialog-store";
import { eventBus } from "@/plugins/quasar/event-bus";

export function useBaseDialog() {
  const { dialogStackPop, dialogStackPush } = useOpenDialogStore();

  const isDialogVisible = ref(true);
  const errorMessage = ref<string | null>(null);
  const dialogId = ref<string>("");

  // Get dialogRef and other utilities from Quasar's dialog plugin
  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  function updateDialogState(status: boolean): void {
    isDialogVisible.value = status;
  }

  const handleDialogCloseEvent = (receivedDialogId: string) => {
    if (receivedDialogId === dialogId.value) {
      dialogRef.value?.hide();
    }
  };

  onMounted(() => {
    // Now dialogRef comes from Quasar's plugin
    dialogId.value = dialogRef.value?.$el.parentElement.id;
    dialogStackPush(dialogId.value);

    eventBus.on("DialogCloseEvent", handleDialogCloseEvent);
  });

  onUnmounted(() => {
    dialogStackPop(dialogId.value);
    eventBus.off("DialogCloseEvent", handleDialogCloseEvent);
  });

  return {
    dialogId,
    dialogRef, // This now comes from Quasar's plugin
    errorMessage,
    isDialogVisible,
    onDialogHide,
    updateDialogState
  };
}
