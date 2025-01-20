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

    <template v-slot:item="{ row }">
      <div :class="itemClass">
        <app-fav-item
          v-if="tab === 'location'"
          :categoryItem="row"
          :distance="0"
          entity-key="SITE"
          @on-directory-item="$emit('onCategoryDetail', $event)"
        />
        <app-fav-item
          v-else-if="tab === 'business'"
          :categoryItem="row"
          entity-key="BUSINESS"
          :distance="0"
          @on-directory-item="$emit('onCategoryDetail', $event)"
        />
        <app-checkin-item
          v-else
          :siteData="row.siteData"
          :checkInfo="row.checkInfo"
          :i18nKey="i18nKey"
          @click="$emit('onCheckInDetail', row)"
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

  const props = defineProps<{
    siteItems: SiteView[];
    businessItems: BusinessView[];
    checkinItems: CheckInView[];
    isUserLogon: boolean;
    i18nKey: string;
    entityKey: EntityURLKey;
  }>();

  const { t, locale } = useI18n({ useScope: "global" });
  const { isSmallScreen, dateFormatter, translate } = useUtilities(locale.value);
  const $q = useQuasar();

  const tab = ref("location");
  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : undefined));

  const tabItems = ref<TabItem[]>([
    { name: "location", label: t(`${props.i18nKey}.tabItem.location`) },
    { name: "business", label: t(`${props.i18nKey}.tabItem.business`) },
    { name: "checkIn", label: t(`${props.i18nKey}.tabItem.checkIn`) }
  ]);

  const rows = computed(() => {
    switch (tab.value) {
      case "location":
        return props.siteItems;
      case "business":
        return props.businessItems;
      case "checkIn":
        return props.checkinItems;
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

  defineEmits<{
    (e: "onCategoryDetail", value: SiteView | BusinessView): void;
    (e: "onCheckInDetail", value: CheckInView): void;
  }>();
</script>

<style lang="scss">
  .q-table__top {
    padding: 0 !important;
  }
</style>
