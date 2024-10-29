// useCategoryDialogService.ts
import type { DirectoryTypes } from "@/interfaces/types/directory-types";
import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";

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

  function openCategoryDetailDialog(item: any, dialogName: string, customEntityKey?: EntityURLKey,) {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: customEntityKey || entityKey,
        dialogName: dialogName
      }
    });
  }

  function openCommunityItemDialog(
    isDialogOpen: Ref<Boolean>,
    entityKey: EntityURLKey,
    directory: CommunityDirectory,
    dialogName: string
  ) {
    if (isDialogOpen.value) return;
    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-items-dialog/index.vue")
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

  return {
    openCategoryDetailDialog,
    openCategoryItemDialog,
    openCommunityItemDialog
  };
}
