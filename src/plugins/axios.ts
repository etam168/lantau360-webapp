// Third-party imports
import { storeToRefs } from "pinia";

import { EventBus } from "quasar";

// Local imports
import { useUserStore } from "@/stores/user";
import { ENTITY_URL } from "@/constants";

// Create a new axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Helper function to check refresh token expiry time
function isRefreshTokenExpired(refreshTokenExpiry: string | null): boolean {
  if (!refreshTokenExpiry) return true;
  return new Date() > new Date(refreshTokenExpiry);
}

// Helper function to refresh token
async function refreshToken() {
  const userStore = useUserStore();
  const { api } = useApi();
  const { notify } = useUtilities();

  try {
    const userInfo = userStore.userInfo; // Adjust based on your store structure
    if (!userInfo?.refreshToken || !userInfo.token) {
      throw new Error("Missing tokens in user information");
    }

    const response = await api.create(`${ENTITY_URL.REFRESH_TOKEN}`, {
      accessToken: userInfo.token,
      refreshToken: userInfo.refreshToken
    });

    const { accessToken, tokenRefresh } = response.data;

    if (tokenRefresh !== userInfo.refreshToken) {
      userStore.setExpiredToken(accessToken);
      userStore.setRefreshToken(tokenRefresh);
    }
    userStore.setToken(accessToken);

    return accessToken;
  } catch (error) {
    notify("Error refreshing token: " + error, "negative");
    throw error;
  }
}

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    const bus = inject("bus") as EventBus;
    const { userInfo, refreshTokenExpiry } = storeToRefs(userStore);

    // Check if userInfo exists
    if (!userInfo.value) {
      console.warn("User is not logged in.");
      return config;
    }

    // Check if the refresh token is expired
    if (isRefreshTokenExpired(refreshTokenExpiry.value)) {
      bus.emit("logOut");
      // Reject the request with a custom error
      return Promise.reject(new Error("Session expired"));
    }

    // Add the token to the headers
    if (userInfo.value.token) {
      config.headers.Authorization = `Bearer ${userInfo.value.token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const userStore = useUserStore();
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        userStore.LogOut();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
