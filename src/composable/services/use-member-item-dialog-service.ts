// useMemberItemDialogService.ts
import type { Member } from "@/interfaces/models/entities/member";

import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";

export function useMemberItemDialogService() {
  async function openMemberItemDialog(
    isDialogOpen: Ref<Boolean>,
    member: Member,
    entityKey: EntityURLKey
  ) {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/member-items-dialog/index.vue")
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
    openMemberItemDialog
  };
}
