// useCategoryDialogService.ts
import type { DirectoryTypes } from "@/interfaces/types/directory-types";
import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";

export function useCategoryDialogService(entityKey: EntityURLKey) {
  async function openCategoryItemDialog(isDialogOpen: Ref<Boolean>, directory: DirectoryTypes) {
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

  function openCategoryDetailDialog(item: any) {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: entityKey
      }
    });
  }

  function openCommunityItemDialog(isDialogOpen: Ref<Boolean>, directory: CommunityDirectory) {
    if (isDialogOpen.value) return;
    isDialogOpen.value = true;
    alert(JSON.stringify(directory));
    alert(entityKey);
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-items-dialog/index.vue")
      ),
      componentProps: { community: directory, entityKey: entityKey }
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
