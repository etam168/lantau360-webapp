<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    hide-pagination
    separator="cell"
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
          <app-category-item
            :categoryItem="row"
            :entityKey
            :isCheckIn="tab === 'checkIn'"
            :i18nKey="i18nKey"
            @on-directory-item="handleDetail(row)"
          />
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

  defineEmits<{
    (e: "onCategoryDetail", value: SiteView | BusinessView): void;
    (e: "onCheckInDetail", value: CheckInView): void;
  }>();

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

  const $q = useQuasar();
  const { t, locale } = useI18n({ useScope: "global" });
  const { isSmallScreen } = useUtilities(locale.value);
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

  const setTab = (val: string) => (tab.value = val);

  async function handleDetail(item: any) {
    const entityKey = item.siteId ? "SITE" : "BUSINESS";
    const itemData = tab.value == "checkIn" ? item[entityKey.toLowerCase() +"Data"] :item;
    openCategoryDetailDialog(isDialogOpen, itemData, entityKey);
  }
</script>

<style lang="scss" scoped>
  .q-table__top {
    padding: 0 !important;
  }
</style>
