import { useUserStore } from "@/stores/user";
import axios from "axios";

const { refreshToken, notify } = useUtilities();

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use(
  async config => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    // config.headers["X-API-Key"] = "Ab]~#>)*g^23WV|{<O[LJCz5Q6n}5bi%;PeeYHDC5iJm,OC2LcU]IBZyUB7e=T9";
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const token = await refreshToken();
        error.config.headers.Authorization = `Bearer ${token}`;
        return axios.request(error.config);
      } catch (refreshError) {
        notify(JSON.stringify(refreshError), "negative");
        console.error("Error refreshing token:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);
