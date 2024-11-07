<template>
  <q-page>
    <app-carousel-section :data="attractions" @image-click="onImageClick" />
    <weather-section :data="weatherData" />
    <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

    <q-card-actions align="center">
      <app-search-bar @on-search="handleSearchDialog" />
    </q-card-actions>

    <q-tab-panels v-model="tab">
      <q-tab-panel name="all">
        <app-directory-items :data="directoryData" @on-directory-item="onDirectoryItem" />
      </q-tab-panel>

      <q-tab-panel name="resources">
        <app-directory-items :data="resourcesData" @on-directory-item="onDirectoryItem" />
      </q-tab-panel>

      <q-tab-panel name="tripAdvisor">
        <app-directory-items :data="tripAdvisorData" @on-directory-item="onDirectoryItem" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { Directory } from "@/interfaces/models/entities/directory";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { TabItem } from "@/interfaces/tab-item";
  import type { Weather } from "@/interfaces/models/entities/weather";

  // .ts file
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Custom Components
  const weatherSection = defineAsyncComponent(() => import("./components/weather-section.vue"));

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryItemDialog, openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { eventBus } = useUtilities();

  const attractions = ref<SiteView[]>([]);
  const homeDirectories = ref<Directory[]>([]);
  const weatherData = ref<Weather | null>(null);

  const dialogStack = ref<string[]>([]);
  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("all");
  const i18nKey = "home";

  const isDialogOpen = ref(false);

  const tabItems = ref<TabItem[]>([
    { name: "all", label: t(`${i18nKey}.tabItem.allLocations`) },
    { name: "resources", label: t(`${i18nKey}.tabItem.resources`) },
    { name: "tripAdvisor", label: t(`${i18nKey}.tabItem.tripAdvisor`) }
  ]);

  const directoryData = computed(() =>
    homeDirectories.value.filter((dir: Directory) => dir.groupId == 1)
  );

  const resourcesData = computed(() =>
    homeDirectories.value.filter((dir: Directory) => dir.groupId == 3)
  );

  const tripAdvisorData = computed(() =>
    homeDirectories.value.filter((dir: Directory) => dir.groupId == 5)
  );

  function handleSearchDialog(value: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/catergory-items-search-dialog/index.vue")
      ),
      componentProps: {
        query: { searchKeyword: value },
        entityKey: "SITE"
      }
    });
  }

  async function fetchAllData() {
    try {
      const [attractionResponse, weatherResponse, homeDirectoryResponse] = await Promise.all([
        fetchData(ENTITY_URL.ATTRACTION),
        fetchData(ENTITY_URL.WEATHER),
        fetchData(ENTITY_URL.SITE_DIRECTORIES)
      ]);

      attractions.value = attractionResponse.sort((a: any, b: any) => a.siteId - b.siteId);
      weatherData.value = weatherResponse;
      homeDirectories.value = homeDirectoryResponse.filter((dir: Directory) => dir.status === 1);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          error.value = t("errors.404");
        } else {
          error.value = t("errors.anErrorOccured");
        }
      } else {
        error.value = t("errors.anErrorOccured");
      }
    }
  }

  const onImageClick = (item: SiteView) => {
    const dialogName = "SiteHeroDetail";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryDetailDialog(item, dialogName);
  };

  async function onDirectoryItem(directory: Directory) {
    if (isDialogOpen.value) return;
    const dialogName = "SiteItemListDialog";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryItemDialog(isDialogOpen, directory, dialogName);
  }

  onMounted(() => {
    eventBus("DialogStatus").on((status: any, emitter: string) => {
      if (status) {
        dialogStack.value.push(emitter);
      } else {
        dialogStack.value.pop();
      }
    });
  });

  onBeforeRouteLeave((_to, _from, next) => {
    if (dialogStack.value.length > 0) {
      const emitter = dialogStack.value[dialogStack.value.length - 1];
      eventBus(emitter).emit();
      dialogStack.value.pop();
      next(false);
    } else {
      next();
    }
  });

  await fetchAllData();
</script>
