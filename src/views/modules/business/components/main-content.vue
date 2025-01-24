<template>
  <q-table v-bind="$attrs" flat grid hide-header hide-pagination :rowKey="rowKey" :rows="rows">
    <template v-slot:top>
      <q-banner :inline-actions="!isSmallScreen" class="full-width">
        <q-toolbar-title :class="titleClass">{{ $t(`${i18nKey}.title`) }}</q-toolbar-title>

        <template v-slot:action>
          <app-tab-select
            :tab-items="tabItems"
            :current-tab="tab"
            @update:currentTab="setTab"
            :class="$q.screen.lt.sm ? 'justify-center' : ''"
          />
        </template>
      </q-banner>

      <q-card-actions v-if="hasSearchBar" class="full-width" align="center">
        <app-search-bar v-model:keyword="keyword" @on-search="handleSearchDialog" />
      </q-card-actions>
    </template>

    <template v-slot:item="{ row }">
      <div
        :class="[
          tab === PROMOTION ? 'q-pa-md col-xs-6 col-sm-4 col-md-3' : 'col-xs-4 col-md-3 q-pa-xs'
        ]"
      >
        <app-menu-item-promotion
          v-if="tab === PROMOTION"
          :item="row"
          :i18nKey
          @on-promotion-item="handlePromotionItem"
        />
        <app-menu-item-directory v-else :item="row" @on-directory-item="handleDirectoryItem" />
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Types
  import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Props
  const {
    businessPromotion,
    directoryData,
    entityKey,
    i18nKey = ""
  } = defineProps<{
    businessPromotion: BusinessPromotionView[];
    directoryData: BusinessDirectory[];
    entityKey: EntityURLKey;
    i18nKey?: string;
  }>();

  const { t, locale } = useI18n({ useScope: "global" });
  const PROMOTION = "promotion";

  const setTab = (val: string) => (tab.value = val);
  const tab = ref(PROMOTION);

  const tabItems = ref<TabItem[]>([
    { name: PROMOTION, label: t(`${i18nKey}.tabItem.promotion`) },
    { name: "directory", label: t(`${i18nKey}.tabItem.directory`) }
  ]);
  const { openCategoryItemDialog, openCategoryDetailDialog, openCategoryItemSearchDialog } =
    useCategoryDialogService(entityKey);
  const { isSmallScreen, getEntityKeyName } = useUtilities(locale.value);

  const $q = useQuasar();
  const keyword = ref("");
  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));

  const isDialogOpen = ref(false);

  const hasSearchBar = computed(() => {
    return !(tab.value === PROMOTION);
  });

  const rows = computed(() => {
    return tab.value === PROMOTION ? businessPromotion : directoryData;
  });

  const rowKey = computed(() => {
    const entityKeyName = getEntityKeyName(entityKey);
    return tab.value === PROMOTION ? `${entityKeyName}PromotionId` : `${entityKeyName}DirectoryId`;
  });

  function handleSearchDialog() {
    openCategoryItemSearchDialog(isDialogOpen, entityKey, i18nKey, keyword);
  }

  async function handleDirectoryItem(directory: BusinessDirectory) {
    await openCategoryItemDialog(isDialogOpen, directory, i18nKey);
  }

  async function handlePromotionItem(promotion: BusinessPromotionView) {
    if (!isDialogOpen.value) {
      await openCategoryDetailDialog(isDialogOpen, promotion, "BUSINESS_PROMOTION");
    }
  }
</script>

<style lang="scss">
  .q-table__top {
    padding: 0 !important;
  }
</style>
