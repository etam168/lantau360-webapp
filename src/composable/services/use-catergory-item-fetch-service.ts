// useSiteDataFetcherService.ts
import { URL } from "@/constants";
import { useUserStore } from "@/stores/user";
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { CheckIn } from "@/interfaces/models/entities/checkin";

interface FetchSiteDataResult {
  directoryItemsList: CategoryTypes[];
  directoryCheckIns: CheckIn[];
}

export function useSiteDataFetcherService() {
  const { userId, isUserLogon } = useUserStore();

  const fetchSiteData = async (directoryId: number): Promise<FetchSiteDataResult> => {
    try {
      const requestUrls: string[] = [];
      requestUrls.push(`${URL.DIRECTORY_LIST.SITE}/${directoryId}`);

      if (isUserLogon()) {
        requestUrls.push(
          `${URL.MEMBER_DIRECTORY_CHECK_IN}?memberId=${userId}&directoryId=${directoryId}`
        );
      }

      const { api } = useApi();
      const axiosRequests = requestUrls.map((url) => api.get(url));
      const [directoryResponse, checkInResponse] = await Promise.all(axiosRequests);

      const directoryItemsList: CategoryTypes[] = directoryResponse?.data || [];
      const directoryCheckIns: CheckIn[] = checkInResponse?.data || [];

      return { directoryItemsList, directoryCheckIns }; // Explicit return of both values
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  };

  return {
    fetchSiteData,
  };
}
