// useMoreItemService.ts
import type { Member } from "@/interfaces/models/entities/member";

import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";

export function useMoreItemServiceCopy() {
  function openAuthDialog(tabValue: string, isLoading: Ref<Boolean>) {
    isLoading.value = true;
    Dialog.create({
      component: defineAsyncComponent(() => import("@/components/dialog/auth-dialog/index.vue")),
      componentProps: { mode: tabValue }
    });
  }

  function openContentDialog(name: string, isDialogOpen: Ref<Boolean>, isLoading: Ref<Boolean>) {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/more-detail-dialog/index.vue")
      ),
      componentProps: { contentName: name, isLoading: isLoading}
    })
      .onCancel(() => {
        // Reset dialog state when it is dismissed/closed
        isDialogOpen.value = false;
        isLoading.value = false;
        //resetItemLoading(name);
      })
      .onOk(() => {
        // Reset dialog state when it is dismissed/closed
        isDialogOpen.value = false;
        //resetItemLoading(name);
      });
  }

  function openTransactionDialog(
    isDialogOpen: Ref<Boolean>,
    member: Member,
    entityKey: EntityURLKey
  ) {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/member-transaction-dialog/index.vue")
      ),
      componentProps: { member: member, entityKey: entityKey }
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
    openAuthDialog,
    openContentDialog,
    openTransactionDialog
  };
}
