// useMemberItemDialogService.ts
import type { Member } from "@/interfaces/models/entities/member";

import { Dialog } from "quasar";
import { EntityURLKey, ENTITY_URL } from "@/constants";
import { useUserStore } from "@/stores/user";

export function useMemberItemDialogService() {
  const trHistory = ref();
  const trRecent = ref();
  const memberConfig = ref();
  const userStore = useUserStore();
  const { fetchData } = useApi();

  async function fetchTransactionData() {
    try {
      if (userStore.isUserLogon()) {
        const [transactionHistory, recentTransactions, memberConfigResponse] = await Promise.all([
          fetchData(`${ENTITY_URL.MEMBER_TRANSACTIONS}/${userStore.userInfo.userId}`),
          fetchData(`${ENTITY_URL.MEMBER_RECENT_TRANSACTIONS}/${userStore.userInfo.userId}`),
          fetchData(ENTITY_URL.MEMBER_CONFIG)
        ]);

        trRecent.value = recentTransactions?.data ?? [];
        trHistory.value = transactionHistory?.data ?? [];
        memberConfig.value = memberConfigResponse.data;

        userStore.setPoints(
          memberConfig.value?.meta.postPoint ?? 50,
          memberConfig.value?.meta.requestFreePoints ?? 100,
          memberConfig.value?.meta.purchsePrice ?? 100,
          memberConfig.value?.meta.purchsePoints ?? 100
        );

        // Sync user points.
        userStore.fetchMemberPoints();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function openTransactionItemDialog(
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

  async function openContentDialog(
    isLoading: Ref<Boolean>,
    name: string,
    resetItemLoading: (name: string) => void
  ) {
    isLoading.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/more-detail-dialog/index.vue")
      ),
      componentProps: { contentName: name, isLoading: isLoading }
    })
      .onCancel(() => {
        isLoading.value = false;
        resetItemLoading(name);
      })
      .onOk(() => {
        resetItemLoading(name);
      });
  }

  return {
    fetchTransactionData,
    openContentDialog,
    openTransactionItemDialog
  };
}
