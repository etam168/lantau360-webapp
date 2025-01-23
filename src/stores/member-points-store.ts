// stores/member-points-store.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { ENTITY_URL } from "@/constants";
import { useUtilities } from "@/composable/use-utilities";

export const useMemberPointsStore = defineStore(
  "memberPoints",
  () => {
    const { notify } = useUtilities();

    // State
    const totalPoints = ref(0);
    const spendPoints = ref(0);
    const availabelPoints = ref(0);
    const pointsPerPost = ref(0);
    const topUpPoints = ref(0);
    const currentMonthFreeTransactionCount = ref(0);
    const purchasePrice = ref(0);
    const purchasePoints = ref(0);

    // Actions
    async function fetchMemberPoints(userId: string, token: string) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}${ENTITY_URL.MEMBER_POINTS}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const { total, spend, available, currentMonthTransactionCount, memberConfig } =
          response.data;

        setPoints(
          memberConfig?.meta?.postPoint ?? 50,
          memberConfig?.meta?.requestFreePoints ?? 100,
          memberConfig?.meta?.purchsePrice ?? 100,
          memberConfig?.meta?.purchsePoints ?? 100
        );

        setPointsInfo({
          total,
          spend,
          available,
          currentMonthTransactionCount
        });
      } catch (error: any) {
        notify(error, "negative");
        throw error;
      }
    }

    function setPoints(
      perPostPoints: number,
      freeTopUpPoints: number,
      price: number,
      points: number
    ) {
      pointsPerPost.value = perPostPoints;
      topUpPoints.value = freeTopUpPoints;
      purchasePrice.value = price;
      purchasePoints.value = points;
    }

    function setPointsInfo(payload: {
      total: number;
      spend: number;
      available: number;
      currentMonthTransactionCount: number;
    }) {
      totalPoints.value = payload.total;
      spendPoints.value = payload.spend;
      availabelPoints.value = payload.available;
      currentMonthFreeTransactionCount.value = payload.currentMonthTransactionCount;
    }

    function resetPoints() {
      totalPoints.value = 0;
      spendPoints.value = 0;
      availabelPoints.value = 0;
      pointsPerPost.value = 0;
      topUpPoints.value = 0;
      currentMonthFreeTransactionCount.value = 0;
      purchasePrice.value = 0;
      purchasePoints.value = 0;
    }

    return {
      // State
      totalPoints,
      spendPoints,
      availabelPoints,
      pointsPerPost,
      topUpPoints,
      currentMonthFreeTransactionCount,
      purchasePrice,
      purchasePoints,

      // Actions
      fetchMemberPoints,
      setPoints,
      setPointsInfo,
      resetPoints
    };
  },
  {
    persist: true
  }
);
