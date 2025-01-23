import { defineStore } from "pinia";
import { ref } from "vue";
import { usePermissionStore } from "./permission";

export const useUserStore = defineStore(
  "user",
  () => {
    // State
    const userInfo = ref<any>(null); //Stores complete user object

    const refreshTokenExpiry = ref<string | null>(null);
    const expiredToken = ref("");

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

    return {
      // State
      userInfo,
      refreshTokenExpiry,
      expiredToken,

      // Actions
      LogOut,
      SetUserInfo,
      isUserLogon,
      setToken,
      setExpiredToken,
      setRefreshToken,
      setRefreshTokenExpiry
    };
  },
  {
    persist: true
  }
);
