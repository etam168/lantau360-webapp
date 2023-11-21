import {
  changeUserPassword,
  getUserInfo,
  loginByPhone,
  loginByUserName,
  updateUserInfo
} from "@/api/login";

import { IChangePasswordRequest, ILoginRequest } from "@/interfaces/requests";
import { defineStore } from "pinia";
import { usePermissionStore } from "./permission";
import { useUserPictureStore } from "./userPicture";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
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
      avatar: "",
      status: "",
      code: ""
    };
  },
  actions: {
    // Login user
    async loginByUserName(payload: ILoginRequest) {
      const response = await loginByUserName(payload);
      this.SetToken(response?.token);
      this.SetRefreshToken(response?.refreshToken);
      this.SetUserInfo(response);
      const permissionStore = usePermissionStore();
      permissionStore.GenerateRoutes(response as any);
    },

    async UpdateUser(payload: any) {
      await updateUserInfo(payload.id, payload.data);
      this.SetUserInfo({
        email: payload.data.referloEmail,
        name: payload.data.referloAlias,
        phone: payload.data.registeredPhone
      });
    },

    async LoginByPhone(payload: any) {
      const response = await loginByPhone(payload.phone.trim(), payload.password);
      this.SetToken(response.user["token"]);
      this.SetRefreshToken(response.user["refreshToken"]);
      this.SetUserInfo(response.user);
      const permissionStore = usePermissionStore();
      permissionStore.GenerateRoutes(response.user as any);
    },

    async GetUserInfo() {
      try {
        const response = await getUserInfo(this.token);

        // Since mockjs does not support custom status codes, it can only be hacked like this
        if (!response) {
          throw new Error("Verification failed, please login again.");
        }

        // Verify returned roles are a non-null array
        if (response.user["roles"] && response.user["roles"].length === 0) {
          throw new Error("getInfo: roles must be a non-null array!");
        }

        this.SetUserInfo(response.user);
      } catch (err) {
        //console.warn("[pinia.user] GetUserInfo", err);
      }
    },

    async LogOut() {
      try {
        this.SetUserInfo({ logout: true });
        const userPictureStore = useUserPictureStore();
        userPictureStore.ClearUserProfilePicture();
      } catch (err) {
        //console.warn("[pinia.user] LogOut", err);
      }
    },
    async ChangeUserPassword(payload: IChangePasswordRequest) {
      await changeUserPassword(payload);
    },
    SetUserInfo(payload: any) {
      if (payload.logout) {
        this.token = "";
        this.refreshToken = "";
        this.roles = [];
        this.user = "";
        this.userId = "";
        this.staffId = "";
        this.memberId = "";
        this.name = "";
        this.email = "";
        this.phone = "";
        this.avatar = "";
        this.code = "";
      } else {
        this.token = payload.token || this.token;
        this.refreshToken = payload.refreshToken || this.refreshToken;
        this.roles = payload.roles || this.roles;
        this.user = payload.user || this.user;
        this.userId = payload.userId || this.userId;
        this.staffId = payload.staffId || this.staffId;
        this.memberId = payload.memberId || this.memberId;
        this.name = payload.name || this.name;
        this.email = payload.email || this.email;
        this.phone = payload.phone || this.phone;
        this.avatar = payload.profilePic || this.avatar;
        this.code = payload.code || this.code;
      }
    },
    SetToken(token: any) {
      this.token = token;
    },
    SetRefreshToken(refreshToken: any) {
      this.refreshToken = refreshToken;
    }
  },
  persist: true
});
