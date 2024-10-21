// useEntityDataHandlingService.ts
import { Dialog } from "quasar";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-types";
import { EntityURLKey } from "@/constants";

export function useEntityDataHandlingService() {
  const { getEntityName } = useUtilities();
  const { fetchData } = useApi();

  function handleOpenDialog(
    props: Record<string, any>,
    isDialogOpen: Boolean,
    lookUpEntityTypes?: Array<string>,
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
      componentProps: props
    }).onDismiss(() => {
      // Reset dialog state when it is dismissed/closed
      isDialogOpen = false;
    });
  }

  return {
    handleOpenDialog
  };
}
