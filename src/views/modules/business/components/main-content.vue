<template>
  <q-banner :inline-actions="!isSmallScreen">
    <q-toolbar-title :class="titleClass">{{ $t(`${i18nKey}.title`) }}</q-toolbar-title>

    <template v-slot:action>
      <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="tab = $event" />
    </template>
  </q-banner>

  <q-tab-panels v-model="tab">
    <q-tab-panel name="promotion" class="q-pa-sm">
      <app-marketing-item-list :data="businessPromotion" :entity-key="'BUSINESS_PROMOTION'" />
    </q-tab-panel>

    <q-tab-panel name="directory">
      <q-card-actions align="center">
        <app-search-bar @on-search="$emit('onSearch', $event)" />
      </q-card-actions>

      <app-directory-items
        :data="directoryData"
        @on-directory-item="$emit('onDirectoryItem', $event)"
      />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { TabItem } from "@/interfaces/tab-item";

  defineProps<{
    i18nKey: string;
    tabItems: TabItem[];
    businessPromotion: BusinessPromotionView[];
    directoryData: BusinessDirectory[];
  }>();

  const { isSmallScreen } = useUtilities();

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));

  const tab = defineModel<string>("tab", { required: true });

  defineEmits<{
    (e: "onSearch", value: any): void;
    (e: "onDirectoryItem", value: BusinessDirectory): void;
  }>();
</script>
