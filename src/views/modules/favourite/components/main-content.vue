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
        @on-category-detail="$emit('on-category-detail', $event)"
      />
    </q-tab-panel>

    <q-tab-panel name="business" class="q-pa-none">
      <app-category-list-items
        :categoryItems="businessItems"
        :entityKey="'BUSINESS'"
        @on-category-detail="$emit('on-category-detail', $event)"
      />
    </q-tab-panel>
    <q-tab-panel name="checkIn" class="q-pa-none">
      <app-checkin-list-items />
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
  import { ENTITY_URL } from "@/constants";

  // Props
  const { i18nKey } = defineProps<{
    i18nKey: string;
  }>();

  const { t } = i18n.global;
  const { isSmallScreen } = useUtilities();
  const userStore = useUserStore();
  const favStore = useFavoriteStore();
  const checkInStore = useCheckInStore();
  const { fetchData } = useApi();
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
