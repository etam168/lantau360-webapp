<template>
  <q-banner :inline-actions="!isSmallScreen">
    <q-toolbar-title :class="titleClass">{{ title }}</q-toolbar-title>

    <template v-slot:action>
      <app-tab-select
        :tab-items="tabItems"
        :current-tab="tab"
        @update:currentTab="setTab"
        :class="$q.screen.lt.sm ? 'justify-center' : ''"
      />
    </template>
  </q-banner>

  <q-tab-panels v-model="tab">
    <q-tab-panel name="location" class="q-pa-none">
      <app-category-list-items
        :categoryItems="siteItems"
        :entityKey="'SITE'"
        :pageName="'FAVOURITE'"
        @on-category-detail="$emit('on-category-detail', $event)"
      />
    </q-tab-panel>

    <q-tab-panel name="business" class="q-pa-none">
      <app-category-list-items
        :categoryItems="businessItems"
        :entityKey="'BUSINESS'"
        :pageName="'FAVOURITE'"
        @on-category-detail="$emit('on-category-detail', $event)"
      />
    </q-tab-panel>

    <q-tab-panel name="checkIn" class="q-pa-none">
      <app-checkin-list-items :style="tableStyle" i18n-key="favourite.checkIn" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";
  import type { TabItem } from "@/interfaces/tab-item";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { BusinessView } from "@/interfaces/models/views/business-view";

  //Stores
  import { useUserStore } from "@/stores/user";
  import { useFavoriteStore } from "@/stores/favorite-store";
  import { useCheckInStore } from "@/stores/checkin-store";
  import i18n from "@/plugins/i18n/i18n";

  // Constants
  import { ENTITY_URL, MAX_SCREEN_WIDTH } from "@/constants";

  // Props
  const { i18nKey } = defineProps<{
    i18nKey: string;
  }>();

  const $q = useQuasar();
  const { t } = i18n.global;
  const { isSmallScreen, aspectRatio } = useUtilities();
  const { fetchData } = useApi();

  const userStore = useUserStore();
  const favStore = useFavoriteStore();
  const checkInStore = useCheckInStore();
  const siteItems = computed<SiteView[]>(() => favStore.favoriteSites);
  const businessItems = computed<BusinessView[]>(() => favStore.favoriteBusinesses);
  const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));

  // const tab = defineModel<string>("tab", { required: true });
  const tab = ref("location");

  const tabItems = ref<TabItem[]>([
    { name: "location", label: t(`${i18nKey}.tabItem.location`) },
    { name: "business", label: t(`${i18nKey}.tabItem.business`) },
    { name: "checkIn", label: t(`${i18nKey}.tabItem.checkIn`) }
  ]);

  const setTab = (val: string) => (tab.value = val);

  const title = computed(() => {
    const baseTitle = t(`${i18nKey}.title`);
    return userStore.isUserLogon() ? baseTitle : `${baseTitle} (Offline)`;
  });

  const THRESHOLD = 320 as const;

  const usedHeight = computed(() => {
    const ADDITIONAL_HEIGHT = 160 as const;
    const width = Math.min($q.screen.width, MAX_SCREEN_WIDTH);
    const carouselHeigh = width * aspectRatio();

    return carouselHeigh + ADDITIONAL_HEIGHT;
  });

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const height = $q.screen.height - usedHeight.value;
    return height > THRESHOLD ? { height: `calc(100vh - ${usedHeight.value}px)` } : undefined;
  });

  defineEmits<{
    (e: "onSearch", value: any): void;
    (e: "on-category-detail", value: BusinessDirectory): void;
  }>();

  const fetchAllData = async () => {
    try {
      checkinItems.value = await fetchData(`${ENTITY_URL.CHECKIN_BY_MEMBER}/${userStore.userId}`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  onMounted(() => {
    fetchAllData();
  });
</script>
