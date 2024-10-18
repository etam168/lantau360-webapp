// useEntityDataHandlingService.ts
import { Dialog } from "quasar";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-types";
import { EntityURLKey } from "@/constants";

export function useEntityDataHandlingService(entityKey: EntityURLKey) {
  const { getEntityName } = useUtilities();
  const { fetchData } = useApi();

  const lookUpEntityTypes = [
    "MEMBER",
  ];

  // Handle create dialog action
  function handleCreate(
    isDialogOpen: Ref<Boolean>,
    userDefinedComponent?: Component,
    previewComponent?: Component
  ) {
    if (isDialogOpen.value) {
      // Prevent opening another dialog if one is already open
      return;
    }
    // Set the dialog state to open
    isDialogOpen.value = true;
    const props = { entityKey: entityKey, previewComponent: previewComponent };
    switch (true) {
      case !!userDefinedComponent:
        Dialog.create({ component: userDefinedComponent, componentProps: props }).onDismiss(() => {
          // Reset dialog state when it is dismissed/closed
          isDialogOpen.value = false;
        });
        break;

      case lookUpEntityTypes.includes(entityKey):
        const lookupComponent = defineAsyncComponent(
          () => import("@/components/dialog/generic-gallery-input-dialog/index.vue")
        );

        Dialog.create({ component: lookupComponent, componentProps: props }).onDismiss(() => {
          // Reset dialog state when it is dismissed/closed
          isDialogOpen.value = false;
        });
        break;

      default:
        // const defaultComponent = defineAsyncComponent(
        //   () => import("@/components/dialog/generic-input-dialog.vue")
        // );

        // Dialog.create({
        //   component: defaultComponent,
        //   componentProps: props
        // }).onDismiss(() => {
        //   // Reset dialog state when it is dismissed/closed
        //   isDialogOpen.value = false;
        // });
        break;
    }
  }

  function handleDelete(isDialogOpen: Ref<Boolean>, row: Record<string, any>) {
    // if (isDialogOpen.value) {
    //   // Prevent opening another dialog if one is already open
    //   return;
    // }
    // // Set the dialog state to open
    // isDialogOpen.value = true;
    // const props = { row: row, entityKey: entityKey };

    // const deleteComponent = defineAsyncComponent(
    //   () => import("@/components/dialog/generic-delete-dialog.vue")
    // );

    // Dialog.create({
    //   component: deleteComponent,
    //   componentProps: props
    // }).onDismiss(() => {
    //   // Reset dialog state when it is dismissed/closed
    //   isDialogOpen.value = false;
    // });
  }

  // Handle edit dialog action
  function handleUpdate(
    isDialogOpen: Ref<Boolean>,
    rowData: Record<string, any>,
    userDefinedComponent?: Component,
    previewComponent?: Component
  ) {
    if (isDialogOpen.value) {
      // Prevent opening another dialog if one is already open
      return;
    }
    // Set the dialog state to open
    isDialogOpen.value = true;
    // const props: Record<string, any> = {};
    const props = { row: rowData, entityKey: entityKey, previewComponent: previewComponent };

    switch (true) {
      case !!userDefinedComponent:
        Dialog.create({ component: userDefinedComponent, componentProps: props }).onDismiss(() => {
          // Reset dialog state when it is dismissed/closed
          isDialogOpen.value = false;
        });
        break;

      case lookUpEntityTypes.includes(entityKey):
        const lookupComponent = defineAsyncComponent(
          () => import("@/components/dialog/generic-gallery-edit-dialog/index.vue")
        );

        Dialog.create({ component: lookupComponent, componentProps: props }).onDismiss(() => {
          // Reset dialog state when it is dismissed/closed
          isDialogOpen.value = false;
        });
        break;

      default:
        // const defaultComponent = defineAsyncComponent(
        //   () => import("@/components/dialog/generic-edit-dialog.vue")
        // );

        // Dialog.create({
        //   component: defaultComponent,
        //   componentProps: props
        // }).onDismiss(() => {
        //   // Reset dialog state when it is dismissed/closed
        //   isDialogOpen.value = false;
        // });
        break;
    }
  }

  async function getExpandedData(entityId: number) {
    const entityName = getEntityName(entityKey);

    // switch (true) {
    //   case entityName in EXPANDED_ROW_URL:
    //     const imageUrlKey = getImageUrlKey(entityKey);
    //     const { getGalleryImages } = useEntityImageService<GalleryImageType>(imageUrlKey);
    //     const url = EXPANDED_ROW_URL[entityName as ExpandedRowUrlKey];

    //     try {
    //       const [gallery] = await Promise.all([
    //         getGalleryImages(entityId)
    //         // fetchData(`${url}/${entityId}`)
    //       ]);

    //       return {
    //         gallery
    //         // [entityName]: data
    //       };
    //     } catch (error) {
    //       console.error(`Error loading data for ${entityKey}: ${entityId}:`, error);
    //       throw error; // Re-throw the error to be handled by the caller
    //     }

    //   default:
    //     console.log(`Entity ${entityName} not found in EXPANDED_ROW_URL`);
    //     return {};
    // }
  }

  return {
    getExpandedData,
    handleCreate,
    handleDelete,
    handleUpdate
  };
}
