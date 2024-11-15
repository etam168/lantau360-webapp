// useCommunityDialogService.ts
import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";
const { eventBus } = useUtilities();

export function useCommunityDialogService(entityKey: EntityURLKey) {
  async function openCommunityDetailDialog(
    item: any,
    dialogName: string,
    customEntityKey?: EntityURLKey
  ) {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-detail-dialog/index.vue")
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
    openCommunityDetailDialog,
    openCommunityItemDialog
  };
}
