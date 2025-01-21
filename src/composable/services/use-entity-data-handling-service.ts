import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";
import { defineAsyncComponent } from "vue"; // Ensure you import this

export function useEntityDataHandlingService() {
  function handleOpenDialog(
    props: Record<string, any>,
    isDialogOpen: Ref<Boolean>,
    entityKey?: EntityURLKey,
    mode?: string
  ) {
    if (isDialogOpen.value) {
      // Prevent opening another dialog if one is already open
      return;
    }

    // Set the dialog state to open
    isDialogOpen.value = true;

    switch (mode) {
      case "edit": {
        Dialog.create({
          component: defineAsyncComponent(
            () => import("@/components/dialog/generic-gallery-edit-dialog/index.vue")
          ),
          componentProps: {
            row: props.row, // Pass the row prop for the edit dialog
            entityKey: entityKey,
          }
        }).onDismiss(() => {
          // Reset dialog state when it is dismissed/closed
          isDialogOpen.value = false;
        });
        break;
      }
      default: {
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
          isDialogOpen.value = false;
        });
        break;
      }
    }
  }

  function handleOpenCheckInDialog(
    props: Record<string, any>,
    isDialogOpen: Ref<Boolean>,
    entityKey?: EntityURLKey,
    mode?: string
  ) {
    if (isDialogOpen.value) {
      // Prevent opening another dialog if one is already open
      return;
    }

    // Set the dialog state to open
    isDialogOpen.value = true;

    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/checkin-input-dialog/index.vue")
      ),
      componentProps: {
        entityKey: entityKey,
        associatedEntityId: props.associatedEntityId,
        dialogName: props.dialogName,
        site: props.entityData
      }
    }).onDismiss(() => {
      // Reset dialog state when it is dismissed/closed
      isDialogOpen.value = false;
    });
  }

  return {
    handleOpenDialog,
    handleOpenCheckInDialog
  };
}
