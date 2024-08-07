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
      currentMonthFreeTransactionCount: 0
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
        "availabelPoints"
      ];

      if (payload.logout) {
        resetFields.forEach(field => (this[field] = ""));
      } else {
        resetFields.forEach(field => (this[field] = payload[field] || this[field]));
      }

      usePermissionStore().GenerateRoutes(payload);
    },
    isUserLogon() {
      return this.token ? true : false;
    },
    setPoints(perPostPoints: number, freeTopUpPoints: number) {
      this.pointsPerPost = perPostPoints;
      this.topUpPoints = freeTopUpPoints;
    }
  },

  persist: true
});
