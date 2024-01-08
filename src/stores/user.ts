import { defineStore } from "pinia";
import { usePermissionStore } from "./permission";

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
      code: ""
    },

  actions: {
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
        "code"
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
    }
  },

  persist: true
});
