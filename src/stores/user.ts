import { defineStore } from "pinia";
import { ref } from "vue";
import { usePermissionStore } from "./permission";
import { ENTITY_URL } from "@/constants";

const { api } = useApi();
const { notify } = useUtilities();

export const useUserStore = defineStore(
  "user",
  () => {
    // State
    const userInfo = ref<any>(null); //Stores complete user object 

    const refreshTokenExpiry = ref<string | null>(null);
    const expiredToken = ref("");
    
    const totalPoints = ref(0);
    const spendPoints = ref(0);
    const availabelPoints = ref(0);
    const pointsPerPost = ref(0);
    const topUpPoints = ref(0);
    const currentMonthFreeTransactionCount = ref(0);
    const purchasePrice = ref(0);
    const purchasePoints = ref(0);

    // Actions
    async function fetchMemberPoints() {
      try {
        if (!userInfo.value?.token) {
          console.warn("User is not logged in or token is missing.");
          return;
        }

        const response = await api.get(
          `${ENTITY_URL.MEMBER_POINTS}/${userInfo.value?.userId}`
        );

        const { total, spend, available, currentMonthTransactionCount, memberConfig } =
          response.data;

        setPoints(
          memberConfig?.meta?.postPoint ?? 50,
          memberConfig?.meta?.requestFreePoints ?? 100,
          memberConfig?.meta?.purchsePrice ?? 100,
          memberConfig?.meta?.purchsePoints ?? 100
        );

        totalPoints.value = total;
        spendPoints.value = spend;
        availabelPoints.value = available;
        currentMonthFreeTransactionCount.value = currentMonthTransactionCount;
      } catch (error: any) {
        notify(error, "negative");
        throw error;
      }
    }

    async function LogOut() {
      SetUserInfo({ logout: true });
    }

    function SetUserInfo(payload: any) {
      if (payload.logout) {
        userInfo.value = null;
        expiredToken.value = "";
        refreshTokenExpiry.value = null;
      } else {
        userInfo.value = payload;
        expiredToken.value = payload.token ?? "";
        if (payload.refreshToken) {
          setRefreshTokenExpiry();
        }
      }

      usePermissionStore().GenerateRoutes(payload);
    }

    function isUserLogon() {
      return !!userInfo.value?.token;
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

    function setToken(newToken: string) {
      if (userInfo.value) {
        userInfo.value.token = newToken;
      } else {
        console.warn("Cannot set token: userInfo is null or undefined.");
      }
    }

    function setExpiredToken(newExpiredToken: string) {
      expiredToken.value = newExpiredToken;
    }

    function setRefreshToken(newRefreshToken: string) {
      if (userInfo.value) {
        userInfo.value.refreshToken = newRefreshToken;
        setRefreshTokenExpiry();
      } else {
        console.warn("Cannot set refresh token: userInfo is null or undefined.");
      }
    }

    function setRefreshTokenExpiry() {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 6);
      refreshTokenExpiry.value = expiryDate.toISOString();
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

    return {
      // State
      userInfo,
      totalPoints,
      spendPoints,
      availabelPoints,
      pointsPerPost,
      topUpPoints,
      currentMonthFreeTransactionCount,
      refreshTokenExpiry,
      expiredToken,
      purchasePrice,
      purchasePoints,

      // Actions
      fetchMemberPoints,
      LogOut,
      SetUserInfo,
      isUserLogon,
      setPoints,
      setToken,
      setExpiredToken,
      setRefreshToken,
      setRefreshTokenExpiry,
      setPointsInfo
    };
  },
  {
    persist: true
  }
);
