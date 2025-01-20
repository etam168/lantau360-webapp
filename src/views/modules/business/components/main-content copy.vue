<template>
  <q-banner :inline-actions="!isSmallScreen">
    <q-toolbar-title :class="titleClass">{{ $t(`${i18nKey}.title`) }}</q-toolbar-title>

    <template v-slot:action>
      <app-tab-select
        :tab-items="tabItems"
        :current-tab="tab"
        @update:currentTab="tab = $event"
        :class="$q.screen.lt.sm ? 'justify-center' : ''"
      />
    </template>
  </q-banner>

  <q-tab-panels v-model="tab">
    <q-tab-panel name="promotion" class="q-pa-sm">
      <app-marketing-item-list :data="businessPromotion" :entity-key="'BUSINESS_PROMOTION'" />
    </q-tab-panel>

    <q-tab-panel name="directory">
      <q-card-actions align="center">
        <app-search-bar v-model:keyword="keyword" @on-search="handleSearchDialog" />
      </q-card-actions>

      <app-directory-items
        :data="directoryData"
        @on-directory-item="$emit('onDirectoryItem', $event)"
      />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  // Types
  import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Emits
  defineEmits<{
    (e: "onDirectoryItem", value: BusinessDirectory): void;
  }>();

  // Props
  const { tabItems, businessPromotion, directoryData, entityKey, i18nKey } = defineProps<{
    tabItems: TabItem[];
    businessPromotion: BusinessPromotionView[];
    directoryData: BusinessDirectory[];
    entityKey: EntityURLKey;
    i18nKey?: string;
  }>();

  // v-model
  const tab = defineModel<string>("tab", { required: true });

  const { isSmallScreen } = useUtilities();

  const $q = useQuasar();
  const keyword = ref("");
  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));

  function handleSearchDialog(value: any) {
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
</script>
