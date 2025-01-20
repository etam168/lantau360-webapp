<template>
  <q-table v-bind="$attrs" flat hide-header hide-pagination :rows="rows" :row-key="rowKey">
    <template v-slot:top>
      <q-banner :inline-actions="!isSmallScreen" class="full-width">
        <q-toolbar-title :class="titleClass">
          {{ $t(`${i18nKey}.title`) }}{{ !isUserLogon ? " (Offline)" : "" }}
        </q-toolbar-title>

        <template v-slot:action>
          <app-tab-select
            :tab-items="tabItems"
            :current-tab="tab"
            @update:currentTab="setTab"
            :class="$q.screen.lt.sm ? 'justify-center' : ''"
          />
        </template>
      </q-banner>
    </template>

    <template v-slot:body="{ row }">
      <div :class="itemClass">
        <app-fav-item
          v-if="tab === 'location'"
          :categoryItem="row"
          :distance="0"
          entity-key="SITE"
          @on-directory-item="handleDetail(row)"
        />
        <app-fav-item
          v-else-if="tab === 'business'"
          :categoryItem="row"
          entity-key="BUSINESS"
          :distance="0"
          @on-directory-item="handleDetail(row)"
        />
        <app-checkin-item
          v-else
          :siteData="row.siteData"
          :checkInfo="row.checkInfo"
          :i18nKey="i18nKey"
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import type { TabItem } from "@/interfaces/tab-item";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";
  import type { EntityURLKey } from "@/constants";

  const { siteItems, businessItems, checkinItems, isUserLogon, i18nKey, entityKey } = defineProps<{
    siteItems: SiteView[];
    businessItems: BusinessView[];
    checkinItems: CheckInView[];
    isUserLogon: boolean;
    i18nKey: string;
    entityKey: EntityURLKey;
  }>();

  const { t, locale } = useI18n({ useScope: "global" });
  const { isSmallScreen} = useUtilities(locale.value);
  const $q = useQuasar();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const tab = ref("location");
  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : undefined));

  const tabItems = ref<TabItem[]>([
    { name: "location", label: t(`${i18nKey}.tabItem.location`) },
    { name: "business", label: t(`${i18nKey}.tabItem.business`) },
    { name: "checkIn", label: t(`${i18nKey}.tabItem.checkIn`) }
  ]);

  const rows = computed(() => {
    switch (tab.value) {
      case "location":
        return siteItems;
      case "business":
        return businessItems;
      case "checkIn":
        return checkinItems;
      default:
        return [];
    }
  });

  const rowKey = computed(() => {
    switch (tab.value) {
      case "location":
        return "siteId";
      case "business":
        return "businessId";
      case "checkIn":
        return "siteId";
      default:
        return "";
    }
  });

  const itemClass = computed(() => {
    return tab.value === "checkIn" ? "col-12" : "col-xs-12 col-sm-6 col-md-4 q-pa-xs";
  });

  const setTab = (val: string) => (tab.value = val);

  const cardStyle = computed(() => ({
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  }));

  defineEmits<{
    (e: "onCategoryDetail", value: SiteView | BusinessView): void;
    (e: "onCheckInDetail", value: CheckInView): void;
  }>();

  async function handleDetail(item: any) {
    const entityKey = item.siteId ? "SITE" : "BUSINESS";
    openCategoryDetailDialog(item, entityKey);
  }
</script>

<style lang="scss">
  .q-table__top {
    padding: 0 !important;
  }
</style>
