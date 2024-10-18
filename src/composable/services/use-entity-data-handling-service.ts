// useEntityDataHandlingService.ts
import { Dialog } from "quasar";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-types";
import { EntityURLKey } from "@/constants";

export function useEntityDataHandlingService() {
  const { getEntityName } = useUtilities();
  const { fetchData } = useApi();

  function handleOpenDialog(
    userComponent: Component | undefined,
    lookupComponent: Component,
    defaultComponent: Component,
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
    switch (true) {
      case !!userComponent:
        Dialog.create({ component: userComponent, componentProps: props }).onDismiss(() => {
          // Reset dialog state when it is dismissed/closed
          isDialogOpen = false;
        });
        break;

      case lookUpEntityTypes?.includes(entityKey as string):
        Dialog.create({ component: lookupComponent, componentProps: props }).onDismiss(() => {
          // Reset dialog state when it is dismissed/closed
          isDialogOpen = false;
        });
        break;

      default:
        Dialog.create({
          component: defaultComponent,
          componentProps: props
        }).onDismiss(() => {
          // Reset dialog state when it is dismissed/closed
          isDialogOpen = false;
        });
        break;
    }
  }

  return {
    handleOpenDialog
  };
}
