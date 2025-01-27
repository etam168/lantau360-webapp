// useMemberItemDialogService.ts
import type { Member } from "@/interfaces/models/entities/member";

import { Dialog } from "quasar";

export function useMemberItemDialogService() {
  async function openTransactionItemDialog(isDialogOpen: Ref<Boolean>, member: Member) {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/member-transaction-dialog/index.vue")
      ),
      componentProps: { member: member }
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

  async function openContentDialog(
    isDialogOpen: Ref<Boolean>,
    isLoading: Ref<Boolean>,
    name: string
  ) {
    if (isDialogOpen.value) return;
    isLoading.value = true;
    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/terms-privacy-detail-dialog/index.vue")
      ),
      componentProps: { contentName: name, isLoading }
    })
      .onCancel(() => {
        isDialogOpen.value = false;
      })
      .onOk(() => {
        isDialogOpen.value = false;
      });
  }

  async function openAuthDialog(isDialogOpen: Ref<Boolean>, tabValue: string) {
    if (isDialogOpen.value) return;
    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(() => import("@/components/dialog/auth-dialog/index.vue")),
      componentProps: {
        mode: tabValue
      }
    })
      .onDismiss(() => {
        isDialogOpen.value = false;
      })
      .onCancel(() => {
        isDialogOpen.value = false;
      })
      .onOk(() => {
        isDialogOpen.value = false;
      });
  }

  async function openTopUpPointsDialog(isDialogOpen: Ref<Boolean>) {
    if (isDialogOpen.value) return;
    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/top-up-detail-dialog/index.vue")
      )
    })
      .onCancel(() => {
        isDialogOpen.value = false;
      })
      .onOk(() => {
        isDialogOpen.value = false;
      });
  }

  function openEditProfileDialog(isDialogOpen: Ref<Boolean>) {
    if (isDialogOpen.value) {
      // Prevent opening another dialog if one is already open
      return;
    }

    // Set the dialog state to open
    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/generic-gallery-edit-dialog/index.vue")
      ),
      componentProps: {
        entityKey: "MEMBER"
      }
    }).onDismiss(() => {
      // Reset dialog state when it is dismissed/closed
      isDialogOpen.value = false;
    });
  }

  return {
    openContentDialog,
    openEditProfileDialog,
    openTransactionItemDialog,
    openAuthDialog,
    openTopUpPointsDialog
  };
}
