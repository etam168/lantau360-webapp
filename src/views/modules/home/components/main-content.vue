<template>
  <q-table flat grid hide-header hide-pagination :rowKey :rows>
    <template v-slot:top>
      <app-tab-select
        :tab-items="tabItems"
        :current-tab="tab"
        @update:currentTab="setTab"
        :class="$q.screen.lt.sm ? 'justify-center' : ''"
      />

      <q-card-actions class="full-width" align="center">
        <app-search-bar v-model:keyword="keyword" @on-search="handleSearchDialog" />
      </q-card-actions>
    </template>

    <template v-slot:item="{ row }">
      <div class="col-xs-4 col-md-3 q-pa-xs">
        <app-menu-item-seeing
          v-if="tab === SITESEEING"
          :item="row"
          :i18nKey
          @on-directory-item="handleDirectoryItem"
        />
        <app-menu-item-directory v-else :item="row" @on-directory-item="handleDirectoryItem" />
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Types
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Props
  const {
    directoryData,
    resourcesData,
    sightSeeingData,
    entityKey,
    i18nKey = ""
  } = defineProps<{
    directoryData: SiteDirectory[];
    resourcesData: SiteDirectory[];
    sightSeeingData: SiteDirectory[];
    entityKey: EntityURLKey;
    i18nKey?: string;
  }>();

  const { t, locale } = useI18n({ useScope: "global" });
  const SITESEEING = "sightSeeing";
  const setTab = (val: string) => (tab.value = val);
  const tab = ref("all");

  const tabItems = ref<TabItem[]>([
    { name: "all", label: t(`${i18nKey}.tabItem.allLocations`) },
    { name: "resources", label: t(`${i18nKey}.tabItem.resources`) },
    { name: "sightSeeing", label: t(`${i18nKey}.tabItem.sightSeeing`) }
  ]);
  const { isSmallScreen } = useUtilities();

  const $q = useQuasar();
  const keyword = ref("");

  const isDialogOpen = ref(false);

  const rows = computed(() => {
    switch (tab.value) {
      case "all":
        return directoryData;
      case "resources":
        return resourcesData;
      case "sightSeeing":
        return sightSeeingData;
      default:
        return directoryData;
    }
  });

  const rowKey = computed(() => "siteDirectoryId");
  const { openCategoryItemDialog } = useCategoryDialogService(entityKey);

  function handleSearchDialog() {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/catergory-items-search-dialog/index.vue")
      ),
      componentProps: {
        entityKey: entityKey,
        i18nKey: i18nKey,
        keyword: keyword.value
      }
    }).onDismiss(() => {
      keyword.value = "";
    });
  }

  async function handleDirectoryItem(directory: SiteDirectory) {
    if (!isDialogOpen.value) {
      await openCategoryItemDialog(isDialogOpen, directory, i18nKey);
    }
  }
</script>

<style lang="scss">
  .q-table__top {
    padding: 0 !important;
  }
</style>
