// useCommunityDialogService.ts
import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

import { Dialog } from "quasar";
import { ENTITY_URL, EntityURLKey, TEMPLATE } from "@/constants";
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
import type { BusinessView } from "@/interfaces/models/views/business-view";
const { eventBus } = useUtilities();

export interface RenderItem {
  name: string;
  hasCheckIn?: boolean;
  itemCount?: number;
  type: "carousel" | "description" | "contact";
}

export function useCommunityDialogService(entityKey: EntityURLKey, category?: CategoryTypes) {
  const galleryItems = ref<GalleryImageType[]>([]);
  const { fetchData } = useApi();
  const { getEntityId, getEntityName } = useUtilities();

  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "COMMUNITY_DIRECTORY":
          await loadData(`${ENTITY_URL.BUSINESS_GALLERY}/${(category as BusinessView).businessId}`);
          break;
        case "COMMUNITY_EVENT":
        case "COMMUNITY_NOTICE":
        case "POSTING":
          await loadCommunityData(entityKey);
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

  const loadCommunityData = async (entityKey: EntityURLKey) => {
    const entityName =
      entityKey === "ADVERTISEMENT" ? getEntityName("BUSINESS") : getEntityName(entityKey);
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

  async function openCommunityDetailDialog(
    item: any,
    dialogName: string,
    customEntityKey?: EntityURLKey
  ) {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-detail-dialog/index.vue")
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

  function openCommunityItemDialog(
    isDialogOpen: Ref<Boolean>,
    entityKey: EntityURLKey,
    directory: CommunityDirectory,
    dialogName: string
  ) {
    if (isDialogOpen.value) return;
    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-items-dialog/index.vue")
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

  return {
    galleryItems,
    fetchAllData,
    openCommunityDetailDialog,
    openCommunityItemDialog
  };
}
