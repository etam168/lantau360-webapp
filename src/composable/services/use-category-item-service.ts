// useCategoryItemService.ts
import type { Directory } from "@/interfaces/models/entities/directory";

import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";

export function useCategoryItemService(entityKey: EntityURLKey) {
  async function openCategoryItemDialog(isDialogOpen: Ref<Boolean>, directory: Directory) {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;

    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-items-dialog/index.vue")
      ),
      componentProps: { directory: directory, entityKey: entityKey }
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

  return {
    openCategoryItemDialog
  };
}
