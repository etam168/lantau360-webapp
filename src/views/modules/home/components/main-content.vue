<template>
  <weather-section :data="weatherData" />
  <app-tab-select
    :tab-items="tabItems"
    :current-tab="tab"
    @update:currentTab="tab = $event"
    :class="$q.screen.lt.sm ? 'justify-center' : ''"
  />

  <q-card-actions align="center">
    <app-search-bar @on-search="$emit('onSearch', $event)" />
  </q-card-actions>

  <q-tab-panels v-model="tab">
    <q-tab-panel name="all">
      <app-directory-items
        :data="directoryData"
        @on-directory-item="$emit('onDirectoryItem', $event)"
      />
    </q-tab-panel>

    <q-tab-panel name="resources">
      <app-directory-items
        :data="resourcesData"
        @on-directory-item="$emit('onDirectoryItem', $event)"
      />
    </q-tab-panel>

    <q-tab-panel name="sightSeeing">
      <app-directory-items
        :data="sightSeeingData"
        @on-directory-item="$emit('onDirectoryItem', $event)"
      />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";
  import type { TabItem } from "@/interfaces/tab-item";
  import type { Weather } from "@/interfaces/models/entities/weather";

  defineProps<{
    weatherData: Weather | null;
    tabItems: TabItem[];
    directoryData: SiteDirectory[];
    resourcesData: SiteDirectory[];
    sightSeeingData: SiteDirectory[];
  }>();

  const tab = defineModel<string>("tab", { required: true });

  defineEmits<{
    (e: "onSearch", value: any): void;
    (e: "onDirectoryItem", value: SiteDirectory): void;
  }>();

  // Custom Components
  const weatherSection = defineAsyncComponent(() => import("./weather-section.vue"));
</script>
