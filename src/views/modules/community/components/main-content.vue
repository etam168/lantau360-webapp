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
    <q-tab-panel name="events" class="q-pa-sm">
      <app-bulletin-item-list :items="events" :entity-key="'COMMUNITY_EVENT'" />
    </q-tab-panel>

    <q-tab-panel name="notice">
      <app-bulletin-item-list :items="notices" :entity-key="'COMMUNITY_NOTICE'" />
    </q-tab-panel>

    <q-tab-panel name="directory">
      <app-directory-items
        :data="directoryData"
        @on-directory-item="$emit('onDirectoryItem', $event)"
      />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import type { CommunityEventView } from "@/interfaces/models/views/community-event-view";
  import type { CommunityNoticeView } from "@/interfaces/models/views/community-notice-view";
  import type { TabItem } from "@/interfaces/tab-item";

  // Interface files

  defineProps<{
    i18nKey: string;
    tabItems: TabItem[];
    notices: CommunityNoticeView[];
    events: CommunityEventView[];
    directoryData: CommunityDirectory[];
  }>();

  const { isSmallScreen } = useUtilities();

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));

  const tab = defineModel<string>("tab", { required: true });

  defineEmits<{
    (e: "onSearch", value: any): void;
    (e: "onDirectoryItem", value: CommunityDirectory): void;
  }>();
</script>
