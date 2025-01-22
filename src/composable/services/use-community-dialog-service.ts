// useCommunityDialogService.ts
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";
import { useUserStore } from "@/stores/user";
import { EventBus } from "quasar";

const { notify } = useUtilities();
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

  const bus = inject("bus") as EventBus;

  async function openCommunityDetailDialog(
    isDialogOpen: Ref<Boolean>,
    item: any,
    customEntityKey?: EntityURLKey
  ) {
    if (isDialogOpen.value) return;
    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: customEntityKey || entityKey
      }
    })
      .onOk(() => {
        isDialogOpen.value = false;
      })
      .onCancel(() => {
        // Handle the Cancel action
        isDialogOpen.value = false;
        bus.emit("refreshData");
      });
  }

  function openCommunityItemDialog(
    isDialogOpen: Ref<Boolean>,
    entityKey: EntityURLKey,
    directory: CommunityDirectory
  ) {
    if (isDialogOpen.value) return;
    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-items-dialog/index.vue")
      ),
      componentProps: { directory: directory, entityKey: entityKey }
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

  async function handleCreatePosting(isDialogOpen: Ref<Boolean>, directory: CommunityDirectory) {
    if (isDialogOpen.value) return;
    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/create-posting-alert-dialog.vue")
      ),
      componentProps: {
        directory: directory, // Pass the row prop for the edit dialog
        entityKey: entityKey
      }
    }).onCancel(() => {
      // Reset dialog state when it is dismissed/closed
      isDialogOpen.value = false;
    });
  }

  async function handleEditPosting(
    isDialogOpen: Ref<Boolean>,
    item: CategoryTypes,
    entityKey: EntityURLKey
  ) {
    if (isDialogOpen.value) return;
    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/generic-gallery-edit-dialog/index.vue")
      ),
      componentProps: { row: item, entityKey }
    }).onCancel(() => {
      // Reset dialog state when it is dismissed/closed
      isDialogOpen.value = false;
    });
  }

  async function openCreatePosting(isDialogOpen: Ref<Boolean>, directory: CommunityDirectory) {
    if (isDialogOpen.value) return;
    isDialogOpen.value = true;
    if (isUserLogon()) {
      // Fetch additional member points
      await userStore.fetchMemberPoints();
      // Check whether user have required point to create post
      if (userStore.availabelPoints < userStore.pointsPerPost) {
        notify("Dont have enough points to post", "negative");
        return;
      }

      const entityKey = "POSTING" as EntityURLKey;
      const props = { associatedEntityId: directory.communityDirectoryId, entityKey: entityKey };
      // handleOpenDialog(props, isDialogOpen, entityKey);
      // TO DO, USE new custom dialog for posting to keep it simple
    } else {
      Dialog.create({
        component: defineAsyncComponent(() => import("@/components/dialog/login-alert-dialog.vue"))
      })
        .onCancel(() => {
          // Reset dialog state when it is dismissed/closed
          isDialogOpen.value = false;
        })
        .onOk(() => {
          if (userStore.isUserLogon()) {
            // To be implemented
            const entityKey = "POSTING" as EntityURLKey;
            const props = {
              associatedEntityId: directory.communityDirectoryId,
              entityKey: entityKey
            };
            handleOpenDialog(props, isDialogOpen, entityKey);
          }
          // Reset dialog state when it is dismissed/closed
          isDialogOpen.value = false;
        });
    }
  }

  return {
    galleryItems,
    openCreatePosting,
    handleCreatePosting,
    handleEditPosting,
    openCommunityDetailDialog,
    openCommunityItemDialog
  };
}
