// .ts file
import { useUserStore } from "@/stores/user";

const httpMethods = {
  get: async (path: any, options?: any) => axios.get(path, { params: options }),
  create: (path: any, item: any, config = {}) => axios.post(path, item, config),
  update: (path: any, item: any, config?: any) => axios.put(path, item, config),
  delete: (path: any) => axios.delete(path)
};

export function useCommunication() {
  function navigateToPhone(telPhoneNumber: string) {
    const phoneURL = `tel:${telPhoneNumber}`;
    window.location.href = phoneURL;
  }
  function navigateToWhatsApp(whatsAppNumber: string) {
    const whatsappURL = `https://wa.me/${whatsAppNumber}?text=Hello,%20Welcome%20to%20Lantau360.`;
    window.open(whatsappURL, "_blank");
  }

  async function refreshToken() {
    const userStore = useUserStore();
    try {
      const response = await axios.post(`/MemberAuth/RefreshToken`, {
        accessToken: userStore.token,
        refreshToken: userStore.refreshToken
      });
      const { accessToken, tokenRefresh } = response.data;
      userStore.token = accessToken;
      userStore.refreshToken = tokenRefresh;
      return accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  return {
    httpMethods,
    navigateToPhone,
    navigateToWhatsApp,
    refreshToken
  };
}
