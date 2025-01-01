import { defineStore } from "pinia";
import { usePermissionStore } from "./permission";
import { ENTITY_URL } from "@/constants";
const { api } = useApi();
const { notify } = useUtilities();

export const useUserStore = defineStore(
  "user",
  () => {
    // State
    const token = ref("");
    const expiredToken = ref("");
    const refreshToken = ref("");
    const roles = ref([]);
    const user = ref("");
    const userId = ref(0);
    const staffId = ref(0);
    const memberId = ref(0);
    const name = ref("");
    const email = ref("");
    const phone = ref("");
    const profilePic = ref("");
    const status = ref(0);
    const code = ref("");
    const totalPoints = ref(0);
    const spendPoints = ref(0);
    const availabelPoints = ref(0);
    const pointsPerPost = ref(0);
    const topUpPoints = ref(0);
    const currentMonthFreeTransactionCount = ref(0);
    const refreshTokenExpiry = ref<string | null>(null); // Fixed type here
    const purchasePrice = ref(0);
    const purchasePoints = ref(0);

    // Actions
    async function fetchMemberPoints() {
      try {
        if (!token.value) {
          return;
        }
        const response = await api.get(`${ENTITY_URL.MEMBER_POINTS}/${userId.value}`);
        const { total, spend, available, currentMonthTransactionCount, memberConfig } =
          response.data;

        setPoints(
          memberConfig.value?.meta.postPoint ?? 50,
          memberConfig.value?.meta.requestFreePoints ?? 100,
          memberConfig.value?.meta.purchsePrice ?? 100,
          memberConfig.value?.meta.purchsePoints ?? 100
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
      // Fields to reset
      const resetFields: (keyof typeof fieldsMap)[] = [
        "token",
        "expiredToken",
        "refreshToken",
        "roles",
        "user",
        "userId",
        "staffId",
        "memberId",
        "name",
        "email",
        "phone",
        "profilePic",
        "code",
        "totalPoints",
        "spendPoints",
        "availabelPoints",
        "refreshTokenExpiry"
      ];

      // A mapping of fields to their reactive references
      const fieldsMap = {
        token,
        expiredToken,
        refreshToken,
        roles,
        user,
        userId,
        staffId,
        memberId,
        name,
        email,
        phone,
        profilePic,
        code,
        totalPoints,
        spendPoints,
        availabelPoints,
        refreshTokenExpiry
      };

      if (payload.logout) {
        // Reset fields to empty string or null for token-related fields
        resetFields.forEach(field => {
          const refField = fieldsMap[field];
          if (refField) refField.value = "";
        });
      } else {
        // Update fields with the values from payload
        resetFields.forEach(field => {
          const refField = fieldsMap[field];
          if (refField) {
            refField.value = payload[field] || refField.value;
          }
        });

        expiredToken.value = payload.token;

        if (payload.refreshToken) {
          setRefreshTokenWithExpiry();
        }
      }

      usePermissionStore().GenerateRoutes(payload);
    }

    function isUserLogon() {
      return token.value ? true : false;
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
      token.value = newToken;
    }

    function setExpiredToken(newExpiredToken: string) {
      expiredToken.value = newExpiredToken;
    }

    function setRefreshToken(newRefreshToken: string) {
      refreshToken.value = newRefreshToken;
      setRefreshTokenWithExpiry();
    }

    function setRefreshTokenWithExpiry() {
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
      token,
      refreshToken,
      roles,
      user,
      userId,
      staffId,
      memberId,
      name,
      email,
      phone,
      profilePic,
      status,
      code,
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
      setRefreshTokenWithExpiry,
      setPointsInfo
    };
  },
  {
    persist: true
  }
);
