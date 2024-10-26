// Third-party imports
import { storeToRefs } from "pinia";

// Local imports
import { useUserStore } from "@/stores/user";
import { URL } from "@/constants";

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
    const response = await api.create(`${URL.REFRESH_TOKEN}`, {
      accessToken: userStore.expiredToken,
      refreshToken: userStore.refreshToken
    });
    const { accessToken, tokenRefresh } = response.data;

    if (tokenRefresh !== userStore.refreshToken) {
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
    const { eventBus } = useUtilities();
    const { token, refreshTokenExpiry } = storeToRefs(userStore);

    // Check if the refresh token is expired
    if (refreshTokenExpiry.value) {
      if (isRefreshTokenExpired(refreshTokenExpiry.value)) {
        // eventBus("logOut").emit();
        // Reject the request with a custom error
        return Promise.reject(new Error("Session expired"));
      }
    }

    alert("Interceptor: " + token.value);

    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
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
        userStore.logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
