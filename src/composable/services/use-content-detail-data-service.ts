import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { ENTITY_URL, EntityURLKey, TEMPLATE } from "@/constants";
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
import type { SiteView } from "@/interfaces/models/views/site-view";
import type { CheckIn } from "@/interfaces/models/entities/checkin";
import type { Content } from "@/interfaces/models/entities/content";

export function useContentDetailDataService(category: CategoryTypes, entityKey: EntityURLKey) {
  const userStore = useUserStore();
  const galleryItems = ref<GalleryImageType[]>([]);
  const memberConfig = ref();
  const checkInData = ref();
  const { fetchData } = useApi();
  const { getEntityId, getEntityName } = useUtilities();
  const entityName =
    entityKey === "ADVERTISEMENT" ? getEntityName("BUSINESS") : getEntityName(entityKey);

  const entityId = getEntityId(category as any, entityName);

  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "SITE":
          await loadData(`${ENTITY_URL.SITE_GALLERY}/${(category as SiteView).siteId}`);
          if (userStore.isUserLogon()) {
            await loadMemberCheckInDetail();
          }
          break;
        case "ADVERTISEMENT":
          await loadBusinessData("BUSINESS");
        case "BUSINESS":
        case "BUSINESS_PROMOTION":
          await loadBusinessData(entityKey);
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
        const maskValue = getMaskValue(category.directoryTemplate || 0);
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

  const loadBusinessData = async (entityKey: EntityURLKey) => {
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

  return { galleryItems, memberConfig, checkInData, fetchAllData };
}
