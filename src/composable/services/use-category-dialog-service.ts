import type { DirectoryTypes } from "@/interfaces/types/directory-types";
import type { CategoryTypes } from "@/interfaces/types/category-types";

import { Dialog } from "quasar";
import { EntityURLKey } from "@/constants";
import i18n from "@/plugins/i18n/i18n";

const { notify } = useUtilities();
const { t } = i18n.global;

export function useCategoryDialogService(entityKey: EntityURLKey) {
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
   * Opens a dialog for displaying category search items.
   */
  async function openCategoryItemSearchDialog(
    isDialogOpen: Ref<Boolean>,
    entityKey: EntityURLKey,
    i18nKey?: string,
    keyword?: Ref<string>
  ) {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/catergory-items-search-dialog/index.vue")
      ),
      componentProps: {
        entityKey: entityKey,
        i18nKey: i18nKey,
        keyword: keyword?.value
      }
    })
      .onCancel(() => {
        // Reset dialog state when it is dismissed/closed
        isDialogOpen.value = false;
        keyword!.value = "";
      })
      .onOk(() => {
        // Reset dialog state when it is dismissed/closed
        isDialogOpen.value = false;
        keyword!.value = "";
      });
  }

  /**
   * Opens a dialog for displaying detailed information about a category.
   */
  async function openCategoryDetailDialog(
    isDialogOpen: Ref<Boolean>,
    item: any,
    entityKey: EntityURLKey,
    displayMask?: number
  ) {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;
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
      .onOk(() => {
        isDialogOpen.value = false;
      })
      .onCancel(() => {
        // Handle the Cancel action
        isDialogOpen.value = false;
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
    openCategoryDetailDialog,
    openCategoryItemDialog,
    openCategoryItemSearchDialog,
    openGoogleMaps
  };
}
