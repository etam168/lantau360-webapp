// useCommunityDialogService.ts
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

import { Dialog } from "quasar";
import { ENTITY_URL, EntityURLKey } from "@/constants";
import { useUserStore } from "@/stores/user";

const { eventBus } = useUtilities();
const userStore = useUserStore();
const { isUserLogon } = userStore;
const { handleOpenDialog } = useEntityDataHandlingService();

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

  async function fetchAllData(category: CategoryTypes) {
    try {
      switch (entityKey) {
        case "COMMUNITY_EVENT":
        case "COMMUNITY_NOTICE":
        case "POSTING":
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

  function openCreatePosting(isDialogOpen: Ref<Boolean>, directory: CommunityDirectory) {
    if (isUserLogon()) {
      // To be implemented
      const entityKey = "POSTING" as EntityURLKey;
      const props = { associatedEntityId: directory.communityDirectoryId, entityKey: entityKey };
      handleOpenDialog(props, isDialogOpen, entityKey);
    } else {
      Dialog.create({
        component: defineAsyncComponent(
          () => import("@/components/dialog/community-items-dialog/login-alert-dialog.vue")
        )
      }).onOk(() => {
        if (userStore.isUserLogon()) {
          // To be implemented
          const entityKey = "POSTING" as EntityURLKey;
          const props = {
            associatedEntityId: directory.communityDirectoryId,
            entityKey: entityKey
          };
          handleOpenDialog(props, isDialogOpen, entityKey);
        }
      });
    }
  }

  return {
    galleryItems,
    openCreatePosting,
    fetchAllData,
    openCommunityDetailDialog,
    openCommunityItemDialog
  };
}
