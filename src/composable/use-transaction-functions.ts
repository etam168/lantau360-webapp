import { useUserStore } from "@/stores/user";
import { ENTITY_URL } from "@/constants";

export function useTransactionsFunctions() {
  const trHistory = ref();
  const trRecent = ref();
  const memberConfig = ref();

  const userStore = useUserStore();
  const { fetchData } = useApi();

  async function fetchTransactionData() {
    try {
      if (userStore.isUserLogon()) {
        const [transactionHistory, recentTransactions, memberConfigResponse] = await Promise.all([
          fetchData(`${ENTITY_URL.MEMBER_TRANSACTIONS}/${userStore.userId}`),
          fetchData(`${ENTITY_URL.MEMBER_RECENT_TRANSACTIONS}/${userStore.userId}`),
          fetchData(ENTITY_URL.MEMBER_CONFIG)
        ]);

        trRecent.value = recentTransactions?.data ?? [];
        trHistory.value = transactionHistory?.data ?? [];
        memberConfig.value = memberConfigResponse.data;

        userStore.setPoints(
          memberConfig.value?.meta.postPoint ?? 50,
          memberConfig.value?.meta.requestFreePoints ?? 100
        );

        // Sync user points.
        userStore.fetchMemberPoints();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return {
    trHistory,
    trRecent,
    memberConfig,
    fetchTransactionData
  };
}
