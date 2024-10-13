import { useCommunication } from "@/composable/use-communication";
import { useUserStore } from "@/stores/user";
import axios from "axios";

const { refreshToken } = useCommunication();
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Create a new axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});


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
        // console.error("Error refreshing token:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
