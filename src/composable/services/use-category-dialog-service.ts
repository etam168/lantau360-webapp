import type { DirectoryTypes } from "@/interfaces/types/directory-types";
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { CheckIn } from "@/interfaces/models/entities/checkin";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

import { Dialog } from "quasar";
import { ENTITY_URL, EntityURLKey } from "@/constants";
import { useUserStore } from "@/stores/user";

import i18n from "@/plugins/i18n/i18n";

const { eventBus, notify } = useUtilities();
const { t } = i18n.global;

interface FetchSiteDataResult {
  directoryItemsList: CategoryTypes[];
  directoryCheckIns: CheckIn[];
}

export function useCategoryDialogService(entityKey: EntityURLKey) {
  const galleryItems = ref<GalleryImageType[]>([]);
  const memberConfig = ref();
  const checkInData = ref();
  const { api, fetchData } = useApi();
  const { getEntityId, getEntityName } = useUtilities();

  async function fetchAllData(category: CategoryTypes) {
    try {
      switch (entityKey) {
        case "SITE":
        case "ADVERTISEMENT":
        case "BUSINESS":
        case "BUSINESS_PROMOTION":
          const entityName = getEntityName(entityKey);
          const id = getEntityId(category, entityName);
          const baseUrl = ENTITY_URL[`${entityKey}_GALLERY`];
          const finalUrl = `${baseUrl}/${id}`;
          const response = await fetchData<GalleryImageType[]>(finalUrl);
          galleryItems.value = response;
          break;
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  /**
   * Opens a dialog for displaying category items.
   */
  async function openCategoryItemDialog(
    isDialogOpen: Ref<Boolean>,
    directory: DirectoryTypes,
    i18nKey?: string
  ) {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-items-dialog/index.vue")
      ),
      componentProps: {
        directory: directory,
        entityKey: entityKey,
        i18nKey: i18nKey
      }
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
    entityKey: EntityURLKey,
    displayMask?: number
  ) {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: entityKey,
        displayMask: displayMask
      }
    })
      .onOk(() => {})
      .onCancel(() => {
        // Handle the Cancel action
        // eventBus("refreshData").emit();
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
    openCategoryDetailDialog,
    openCategoryItemDialog,
    openGoogleMaps
  };
}
