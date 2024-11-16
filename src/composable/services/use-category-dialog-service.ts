import type { DirectoryTypes } from "@/interfaces/types/directory-types";
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { CheckIn } from "@/interfaces/models/entities/checkin";
import type { Content } from "@/interfaces/models/entities/content";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
import type { SiteView } from "@/interfaces/models/views/site-view";

import { Dialog } from "quasar";
import { ENTITY_URL, EntityURLKey, TEMPLATE } from "@/constants";
import { useUserStore } from "@/stores/user";

import i18n from "@/plugins/i18n/i18n";

const { eventBus, notify } = useUtilities();
const { t } = i18n.global;

interface FetchSiteDataResult {
  directoryItemsList: CategoryTypes[];
  directoryCheckIns: CheckIn[];
}

export function useCategoryDialogService(entityKey: EntityURLKey, category?: CategoryTypes) {
  const userStore = useUserStore();
  const { userId, isUserLogon } = userStore;
  const galleryItems = ref<GalleryImageType[]>([]);
  const memberConfig = ref();
  const checkInData = ref();
  const { fetchData } = useApi();
  const { getEntityId, getEntityName } = useUtilities();

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

  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "SITE":
          await loadData(`${ENTITY_URL.SITE_GALLERY}/${(category as SiteView).siteId}`);
          if (isUserLogon()) {
            await loadMemberCheckInDetail();
          }
          break;
        case "ADVERTISEMENT":
        case "BUSINESS":
        case "BUSINESS_PROMOTION":
          await loadCategoryGallery(entityKey);
          break;
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const loadData = async (galleryUrl: string) => {
    if (galleryUrl) {
      try {
        const [galleryResponse] = await Promise.all([fetchData<GalleryImageType[]>(galleryUrl)]);
        const maskValue = getMaskValue(category?.directoryTemplate || 0);
        galleryItems.value = galleryResponse
          .filter(element => !((maskValue >> (element.ranking - 1)) & 1))
          .sort((a, b) => a.ranking - b.ranking);
      } catch (err) {
        console.error("Error fetching gallery data:", err);
      }
    }
  };

  const loadMemberCheckInDetail = async () => {
    try {
      const [memberConfigRes, checkInDataRes] = await Promise.all([
        fetchData<Content>(ENTITY_URL.MEMBER_CONFIG),
        fetchData<CheckIn>(
          `${ENTITY_URL.MEMBER_SITE_CHECK_IN}/${userStore.userId}/${(category as SiteView).siteId}`
        )
      ]);

      memberConfig.value = memberConfigRes;
      checkInData.value = checkInDataRes;
    } catch (error) {
      console.error("Error fetching member check-in details:", error);
      throw error;
    }
  };

  const loadCategoryGallery = async (entityKey: EntityURLKey) => {
    const entityName = getEntityName(entityKey);

    const entityId = getEntityId(category as any, entityName);
    const entityUrl = ENTITY_URL[`${entityKey}_GALLERY`];
    if (entityUrl && entityId) {
      await loadData(`${entityUrl}/${entityId}`);
    } else {
      console.warn(`Missing ID or URL for: ${entityKey}`);
    }
  };

  const getMaskValue = (templateValue: number, meta?: any) => {
    // Assuming TEMPLATE is imported or available in the context
    for (const make in TEMPLATE) {
      if (TEMPLATE[make as keyof typeof TEMPLATE].value === templateValue) {
        const modifier = meta?.["hasMap"] === true ? 2 : 0;
        return TEMPLATE[make as keyof typeof TEMPLATE].mask + modifier;
      }
    }
    return 0;
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
    checkInData,
    galleryItems,
    memberConfig,
    fetchAllData,
    fetchSiteData,
    openCategoryDetailDialog,
    openCategoryItemDialog,
    openGoogleMaps
  };
}
