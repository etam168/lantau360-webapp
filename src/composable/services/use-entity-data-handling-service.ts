// useEntityDataHandlingService.ts
import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";

export function useEntityDataHandlingService() {
  function handleOpenDialog(
    props: Record<string, any>,
    isDialogOpen: Boolean,
    entityKey?: EntityURLKey
  ) {
    if (isDialogOpen) {
      // Prevent opening another dialog if one is already open
      return;
    }

    // Set the dialog state to open
    isDialogOpen = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/generic-gallery-input-dialog/index.vue")
      ),
      componentProps: {
        entityKey: entityKey,
        associatedEntityId: props.associatedEntityId,
        dialogName: props.dialogName
      }
    }).onDismiss(() => {
      // Reset dialog state when it is dismissed/closed
      isDialogOpen = false;
    });
  }

  return {
    handleOpenDialog
  };
}
