/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserProfilePicture, updateUserProfilePicture } from "@/api/userPicture";
import { defineStore } from "pinia";
import { useUserStore } from "./user";

export const useUserPictureStore = defineStore("userPicture", {
  state: () => {
    return { profilePicture: "", progress: 0 };
  },

  actions: {
    async GetUserProfilePicture(payload) {
      //console.log("[vuex.user] GetUserProfilePicture");
      try {
        const userStore = useUserStore();
        const response = await getUserProfilePicture(userStore.token, payload);

        if (!response) {
          this.SetUserProfilePicture("img/logo/logo.png");
        }
        if (response) {
          this.SetUserProfilePicture(response.userProfilePicture);
        }
      } catch (err) {
        //console.warn("[pinia.user] GetUserProfilePicture", err);
      }
    },

    async UpdateUserProfilePicture(payload) {
      //console.log("[pinia.user] UpdateUserProfilePicture");
      try {
        const userStore = useUserStore();
        const response = await updateUserProfilePicture(userStore.token, payload);
        //console.log(response);

        if (!response) {
          //console.log("failed to upload");
        }
        if (response) {
          await this.GetUserProfilePicture(payload.memberId);
        }
      } catch (err) {
        //console.warn("[pinia.user] GetUserProfilePicture", err);
      }
    },
    ClearUserProfilePicture() {
      this.profilePicture = "";
    },
    SetUserProfilePicture(payload) {
      const rand = Math.random();
      this.profilePicture = `${payload}?t=${rand}`;
    }
  },
  persist: true
});
