<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    hide-pagination
    :rows="rows"
    :row-key="rowKey"
    :rows-per-page-options="[0]"
  >
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
      <q-tr>
        <q-td colspan="100%">
          <div :class="itemClass">
            <app-checkin-item
              v-if="tab == 'checkIn'"
              :siteData="row.siteData"
              :checkInfo="row.checkInfo"
              :i18nKey="i18nKey"
            />

            <app-category-item
              v-else
              :categoryItem="row"
              :entityKey
              @on-directory-item="handleDetail(row)"
            />
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Types
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import type { EntityURLKey } from "@/constants";

  const {
    siteItems,
    businessItems,
    checkinItems,
    isUserLogon,
    entityKey,
    i18nKey = ""
  } = defineProps<{
    siteItems: SiteView[];
    businessItems: BusinessView[];
    checkinItems: CheckInView[];
    isUserLogon: boolean;
    entityKey: EntityURLKey;
    i18nKey: string;
  }>();

  const { t, locale } = useI18n({ useScope: "global" });
  const { isSmallScreen } = useUtilities(locale.value);
  const $q = useQuasar();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const isDialogOpen = ref(false);
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
    openCategoryDetailDialog(isDialogOpen, item, entityKey);
  }
</script>

<style lang="scss">
  .q-table__top {
    padding: 0 !important;
  }
</style>
