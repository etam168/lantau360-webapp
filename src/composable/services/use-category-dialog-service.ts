import type { DirectoryTypes } from "@/interfaces/types/directory-types";
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { CheckIn } from "@/interfaces/models/entities/checkin";

import { Dialog } from "quasar";
import { ENTITY_URL, EntityURLKey } from "@/constants";
import { useUserStore } from "@/stores/user";

import i18n from "@/plugins/i18n/i18n";

const { eventBus, notify } = useUtilities();
const { t } = i18n.global;

export interface RenderItem {
  name: string;
  hasCheckIn?: boolean;
  itemCount?: number;
  type:
    | "carousel"
    | "gallery"
    | "expansion-description"
    | "description"
    | "favourite"
    | "location"
    | "contact"
    | "timetable"
    | "time"
    | "promotion";
}

interface FetchSiteDataResult {
  directoryItemsList: CategoryTypes[];
  directoryCheckIns: CheckIn[];
}

export function useCategoryDialogService(entityKey: EntityURLKey) {
  const { userId, isUserLogon } = useUserStore();

  /**
   * Fetches data for a directory, including directory items and user check-ins if applicable.
   */
  const fetchSiteData = async (directoryId: number): Promise<FetchSiteDataResult> => {
    try {
      const requestUrls: string[] = [];
      requestUrls.push(`${ENTITY_URL.DIRECTORY_LIST.SITE}/${directoryId}`);

      if (isUserLogon()) {
        requestUrls.push(
          `${ENTITY_URL.MEMBER_DIRECTORY_CHECK_IN}?memberId=${userId}&directoryId=${directoryId}`
        );
      }

      const { api } = useApi();
      const axiosRequests = requestUrls.map(url => api.get(url));
      const [directoryResponse, checkInResponse] = await Promise.all(axiosRequests);

      const directoryItemsList: CategoryTypes[] = directoryResponse?.data || [];
      const directoryCheckIns: CheckIn[] = checkInResponse?.data || [];

      return { directoryItemsList, directoryCheckIns };
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  };

  /**
   * Opens a dialog for displaying category items.
   */
  async function openCategoryItemDialog(
    isDialogOpen: Ref<Boolean>,
    directory: DirectoryTypes,
    dialogName?: string
  ) {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-items-dialog/index.vue")
      ),
      componentProps: { directory: directory, entityKey: entityKey, dialogName: dialogName }
    })
      .onCancel(() => {
        // Reset dialog state when it is dismissed/closed
        isDialogOpen.value = false;
      })
      .onOk(() => {
        // Reset dialog state when it is dismissed/closed
        isDialogOpen.value = false;
      });
  }

  /**
   * Opens a dialog for displaying detailed information about a category.
   */
  async function openCategoryDetailDialog(
    item: any,
    dialogName: string,
    customEntityKey?: EntityURLKey
  ) {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: customEntityKey || entityKey,
        dialogName: dialogName
      }
    })
      .onOk(() => {})
      .onCancel(() => {
        // Handle the Cancel action
        eventBus("refreshData").emit();
      });
  }

  function openGoogleMaps(category: CategoryTypes) {
    if (category.meta?.["hasMap"]) {
      window.open(category.meta?.["mapLink"], "_blank");
    } else {
      notify(t("errors.mapLinkNotAvailable"), "negative");
    }
  }

  return {
    fetchSiteData,
    openCategoryDetailDialog,
    openCategoryItemDialog,
    openGoogleMaps
  };
}
