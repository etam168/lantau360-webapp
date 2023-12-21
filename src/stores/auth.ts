import { defineStore } from "pinia";
import Auth from "@/interfaces/types/auth-type";

export const useAuthStore = defineStore("auth", {
  state: (): Auth => {
    return { loggedIn: false };
  },
  getters: {
    getAuth(state: Auth): boolean {
      return state.loggedIn;
    }
  },
  actions: {
    changeAuth(data: boolean) {
      this.loggedIn = data;
    }
  },
  persist: true
});
