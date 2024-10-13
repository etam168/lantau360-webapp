// src/composables/use-api.ts
import { AxiosResponse } from "axios";
import axiosInstance from "@/plugins/axios";

export function useApi() {
  const api = {
    get: async <T = any>(path: string, options?: any): Promise<AxiosResponse<T>> =>
      axiosInstance.get<T>(path, { params: options }),
    create: <T = any>(path: string, item?: any, config = {}): Promise<AxiosResponse<T>> =>
      axiosInstance.post<T>(path, item, config),
    update: <T = any>(path: string, item?: any, config?: any): Promise<AxiosResponse<T>> =>
      axiosInstance.put<T>(path, item || {}, config),
    delete: <T = any>(path: string): Promise<AxiosResponse<T>> => axiosInstance.delete<T>(path)
  };

  /**
   * Fetches data from the API
   * @param url The API endpoint URL
   * @returns The response data
   */
  const fetchData = async <T = any>(url: string) => {
    const response = await api.get<T>(url);
    return response.data;
  };

  return {
    api,
    fetchData
  };
}
