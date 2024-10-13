<template>
  <q-page>
    <app-carousel-section :data="attractions" :aspect-ratio="aspectRatio()" />
    <weather-section :data="weatherData" />
    <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

    <q-card-actions align="center">
      <app-search-bar @on-search="handleSearchDialog" />
    </q-card-actions>

    <q-tab-panels v-model="tab">
      <q-tab-panel name="all">
        <generic-directory-item-list :data="directoryData" @on-directory-item="onDirectoryItem" />
      </q-tab-panel>

      <q-tab-panel name="resources">
        <generic-directory-item-list :data="resourcesData" @on-directory-item="onDirectoryItem" />
      </q-tab-panel>

      <q-tab-panel name="tripAdvisor">
        <generic-directory-item-list :data="tripAdvisorData" @on-directory-item="onDirectoryItem" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import { Directory } from "@/interfaces/models/entities/directory";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { TabItem } from "@/interfaces/tab-item";
  import { Weather } from "@/interfaces/models/entities/weather";

  import GenericDirectoryItemList from "@/components/custom/generic-directory-item-list.vue";

  // .ts file
  import { URL } from "@/constants";
  import { useUserStore } from "@/stores/user";
  import { CheckIn } from "@/interfaces/models/entities/checkin";

  // Custom Components
  const weatherSection = defineAsyncComponent(() => import("./section/weather-section.vue"));

  const { eventBus } = useUtilities();
  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const { api } = useApi();

  const { aspectRatio } = useUtilities();
  const { isUserLogon, userId } = useUserStore();

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
      component: defineAsyncComponent(() => import("./search-site/index.vue")),
      componentProps: {
        query: { searchKeyword: value }
      }
    });
  }

  async function onDirectoryItem(item: any) {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;
    const requestUrls = [];

    requestUrls.push(`${URL.DIRECTORY_LIST.SITE}/${item.directoryId}`);
    if (isUserLogon())
      requestUrls.push(
        `${URL.MEMBER_DIRECTORY_CHECK_IN}?memberId=${userId}&directoryId=${item.directoryId}`
      );

    try {
      const axiosRequests = requestUrls.map(url => api.get(url));
      const responses = await Promise.all(axiosRequests);

      const directoryResponse = responses[0];
      if (directoryResponse.status === 200) {
        const directoryData = directoryResponse.data;
        const checkInData = responses[1] ? responses[1].data : [];
        CategoryDialog(item, directoryData, checkInData);
      }
    } catch (error) {
      //
    }
  }

  function closeDialog() {
    isDialogOpen.value = false;
  }

  function CategoryDialog(dir: Directory, itemList: SiteView, checkIn: CheckIn[]) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-item-list-dialog.vue")
      ),
      componentProps: {
        directoryItemsList: itemList,
        directory: dir,
        directoryCheckIns: checkIn
      }
    })
      .onCancel(closeDialog)
      .onOk(closeDialog)
      .onDismiss(closeDialog);
  }

  onMounted(() => {
    eventBus.on("DialogStatus", (status: any, emitter: string) => {
      if (status) {
        dialogStack.value.push(emitter);
      } else {
        dialogStack.value = dialogStack.value.filter(item => item != emitter);
      }
    });
  });

  onBeforeRouteLeave((_to, _from, next) => {
    if (dialogStack.value.length > 0) {
      const emitter = dialogStack.value[dialogStack.value.length - 1];
      eventBus.emit(emitter);
      dialogStack.value = dialogStack.value.filter(item => item != emitter);

      next(false);
    } else {
      next();
    }
  });

  try {
    const [attractionResponse, weatherResponse, homeDirectoryResponse] = await Promise.all([
      axios.get<SiteView[]>(URL.ATTRACTION_URL),
      axios.get(URL.WEATHER_URL),
      axios.get<Directory[]>(URL.SITE_DIRECTORIES)
    ]);

    attractions.value = attractionResponse.data.sort((a, b) => a.siteId - b.siteId);
    weatherData.value = weatherResponse.data;
    homeDirectories.value = homeDirectoryResponse.data.filter((dir: Directory) => dir.status === 1);
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
</script>
