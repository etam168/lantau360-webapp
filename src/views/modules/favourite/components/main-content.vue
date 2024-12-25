<template>
  <q-banner :inline-actions="!isSmallScreen">
    <q-toolbar-title :class="titleClass">{{ $t(`${i18nKey}.title`) }}</q-toolbar-title>

    <template v-slot:action>
      <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="tab = $event" />
    </template>
  </q-banner>

  <q-tab-panels v-model="tab">
    <q-tab-panel name="location" class="q-pa-none">
      <app-category-list-items
        :categoryItems="siteItems"
        :checkIns
        :entityKey="'SITE'"
        @on-category-detail="$emit('on-category-detail', $event)"
      />
    </q-tab-panel>

    <q-tab-panel name="business" class="q-pa-none">
      <app-category-list-items
        :categoryItems="businessItems"
        :checkIns
        :entityKey="'BUSINESS'"
        @on-category-detail="$emit('on-category-detail', $event)"
      />
    </q-tab-panel>

    <q-tab-panel name="coupon">
      <div>{{ $t(`${i18nKey}.tabItems.coupon`) }}</div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { TabItem } from "@/interfaces/tab-item";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { BusinessView } from "@/interfaces/models/views/business-view";

  defineProps<{
    i18nKey: string;
    tabItems: TabItem[];
    checkIns: CheckIn[];
    siteItems: SiteView[];
    businessItems: BusinessView[];
  }>();

  const { isSmallScreen } = useUtilities();

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));

  const tab = defineModel<string>("tab", { required: true });

  defineEmits<{
    (e: "onSearch", value: any): void;
    (e: "on-category-detail", value: BusinessDirectory): void;
  }>();
</script>
