<template>
  <q-page>
    <app-bar-title :title="$t(`${i18nKey}.advertisement`)" />
    <app-carousel-section :data="advertisements" @image-click="onImageClick" />
    <q-separator size="4px" color="primary" />

    <main-content
      :site-items="siteItems"
      :business-items="businessItems"
      :checkin-items="checkinItems"
      :is-user-logon="isUserLogon"
      :i18nKey="i18nKey"
      :entityKey="entityKey"
      @on-category-detail="onCategoryDetail"
      @on-checkin-detail="onCheckInDetail"
    />
  </q-page>
</template>

<script setup lang="ts">
// Interface files
import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
import type { BusinessView } from "@/interfaces/models/views/business-view";
import type { SiteView } from "@/interfaces/models/views/site-view";
import type { CheckInView } from "@/interfaces/models/views/checkin-view";
import type { EntityURLKey } from "@/constants";

// Custom Components
import MainContent from "./components/main-content.vue";

// Constants
import { ENTITY_URL } from "@/constants";

// Composables
import { useUserStore } from "@/stores/user";
import { useFavoriteStore } from "@/stores/favorite-store";
import { useCheckInStore } from "@/stores/checkin-store";

// Props
const { entityKey } = defineProps<{
  entityKey: EntityURLKey;
}>();

const userStore = useUserStore();
const favStore = useFavoriteStore();
const checkInStore = useCheckInStore();
const $q = useQuasar();

const { t } = useI18n({ useScope: "global" });
const { fetchData } = useApi();
const { eventBus, getEntityName } = useUtilities();
const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

const advertisements = ref<AdvertisementView[]>([]);
const error = ref<string | null>(null);
const i18nKey = getEntityName(entityKey);
const isDialogOpen = ref(false);

const siteItems = computed<SiteView[]>(() => favStore.favoriteSites);
const businessItems = computed<BusinessView[]>(() => favStore.favoriteBusinesses);
const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);
const isUserLogon = computed(() => userStore.isUserLogon());

async function fetchAllData() {
  try {
    const [advertisementResponse] = await Promise.all([fetchData(ENTITY_URL.ADVERTISEMENT)]);
    advertisements.value = advertisementResponse.filter(
      (adv: AdvertisementView) => adv.status === 1
    );

    if (isUserLogon.value) {
      const isFavouriteSync = await favStore.isFavoritesInSync();
      const isCheckInIsSync = await checkInStore.isCheckInInSync();

      if (!isFavouriteSync || !isCheckInIsSync) {
        promptUserDataSyncAlert();
      }
    }
  } catch (err) {
    handleError(err);
  }
}

function handleError(err: unknown) {
  if (err instanceof AxiosError) {
    error.value = err.response?.status === 404 ? t("errors.404") : t("errors.anErrorOccured");
  } else {
    error.value = t("errors.anErrorOccured");
  }
}

function promptUserDataSyncAlert() {
  $q.dialog({
    component: defineAsyncComponent(() => import("./components/data-sync-alert-dialog.vue"))
  }).onOk(async (selectedOption: string) => {
    isDialogOpen.value = false;
    
    switch (selectedOption) {
      case "local":
        favStore.syncRemoteFromLocal();
        checkInStore.syncRemoteFromLocal();
        break;
      case "server":
        favStore.syncLocalFromRemote();
        checkInStore.syncLocalFromRemote();
        break;
      default:
        console.warn(`Unhandled option: ${selectedOption}`);
    }
  });
}

const onImageClick = (category: AdvertisementView) => {
  openCategoryDetailDialog(category, "ADVERTISEMENT");
};

async function onCategoryDetail(item: SiteView | BusinessView) {
  if (!isDialogOpen.value) {
    const entityType = 'siteId' in item ? "SITE" : "BUSINESS";
    openCategoryDetailDialog(item, entityType);
  }
}

function onCheckInDetail(item: CheckInView) {
  $q.dialog({
    component: defineAsyncComponent(
      () => import("@/components/dialog/checkin-detail-dialog/index.vue")
    ),
    componentProps: {
      item,
      dialogName: "checkinDetailDialog"
    }
  });
}

await fetchAllData();
</script>