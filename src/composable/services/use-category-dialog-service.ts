// useCategoryDialogService.ts
import type { DirectoryTypes } from "@/interfaces/types/directory-types";

import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";
const { eventBus } = useUtilities();

export function useCategoryDialogService(entityKey: EntityURLKey) {
  async function openCategoryItemDialog(
    isDialogOpen: Ref<Boolean>,
    directory: DirectoryTypes,
    dialogName?: string
  ) {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-items-dialog/index.vue")
      ),
      componentProps: { directory: directory, entityKey: entityKey, dialogName: dialogName }
    })
      .onCancel(() => {
        // Reset dialog state when it is dismissed/closed
        isDialogOpen.value = false;
      })
      .onOk(() => {
        // Reset dialog state when it is dismissed/closed
        isDialogOpen.value = false;
      });
  }

  async function openCategoryDetailDialog(
    item: any,
    dialogName: string,
    customEntityKey?: EntityURLKey
  ) {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: customEntityKey || entityKey,
        dialogName: dialogName
      }
    })
      .onOk(() => {})
      .onCancel(() => {
        // Handle the Cancel action
        eventBus("refreshData").emit();
      });
  }

  return {
    openCategoryDetailDialog,
    openCategoryItemDialog
  };
}
