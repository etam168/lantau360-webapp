import { defineStore } from "pinia";
import { usePermissionStore } from "./permission";
const { notify } = useUtilities();

export const useUserStore = defineStore("user", {
  state: () =>
    <Record<string, any>>{
      token: "",
      refreshToken: "",
      roles: [],
      user: "",
      userId: "",
      staffId: "",
      memberId: "",
      name: "",
      email: "",
      phone: "",
      profilePic: "",
      status: "",
      code: "",
      totalPoints: 0,
      spendPoints: 0,
      availabelPoints: 0,
      pointsPerPost: 0,
      topUpPoints: 0,
      currentMonthFreeTransactionCount: 0,
      refreshTokenExpiry: null
    },

  actions: {
    async fetchMemberPoints() {
      try {
        if (!this.token) {
          return;
        }
        const response = await axios.get(`/Member/GetMemberPoints/${parseInt(this.userId)}`);
        const { total, spend, available, currentMonthTransactionCount } = response.data;
        (this.totalPoints = total),
          (this.spendPoints = spend),
          (this.availabelPoints = available),
          (this.currentMonthFreeTransactionCount = currentMonthTransactionCount);
      } catch (error: any) {
        notify(error, "negative");

        throw error;
      }
    },
    async LogOut() {
      this.SetUserInfo({ logout: true });
    },

    SetUserInfo(payload: any) {
      const resetFields: Array<string> = [
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

      if (payload.logout) {
        resetFields.forEach(field => (this[field] = ""));
      } else {
        resetFields.forEach(field => (this[field] = payload[field] || this[field]));

        this.expiredToken = payload.token;

         // Set refresh token expiry to 7 days from now
         if (payload.refreshToken) {
          this.setRefreshTokenWithExpiry();
        }
      }

      usePermissionStore().GenerateRoutes(payload);
    },
    isUserLogon() {
      return this.token ? true : false;
    },

    setPoints(
      perPostPoints: number,
      freeTopUpPoints: number,
      purchasePrice: number,
      purchasePoints: number
    ) {
      this.pointsPerPost = perPostPoints;
      this.topUpPoints = freeTopUpPoints;
      this.purchasePrice = purchasePrice;
      this.purchasePoints = purchasePoints;
    },
    setToken(token: string) {
      this.token = token;
    },

    setExpiredToken(expiredToken: string) {
      this.expiredToken = expiredToken;
    },

    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken;
      this.setRefreshTokenWithExpiry();
    },

    setRefreshTokenWithExpiry() {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 6);
      this.refreshTokenExpiry = expiryDate.toISOString();
    },

    setPointsInfo(payload: {
      total: number;
      spend: number;
      available: number;
      currentMonthTransactionCount: number;
    }) {
      this.totalPoints = payload.total;
      this.spendPoints = payload.spend;
      this.availabelPoints = payload.available;
      this.currentMonthFreeTransactionCount = payload.currentMonthTransactionCount;
    }
  },

  persist: true
});
