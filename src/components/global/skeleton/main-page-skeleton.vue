<template>
  <div>
    <app-skeleton-carousel />
    <app-skeleton-weather v-if="entityKey === 'SITE'" />

    <app-skeleton-toolbar v-if="entityKey !== 'SITE'" />

    <q-item class="q-px-md q-gutter-sm" v-if="entityKey === 'SITE'">
      <app-skeleton-chips v-for="chips in 3" :key="chips"
    /></q-item>

    <app-skeleton-search v-if="entityKey === 'SITE'" />

    <q-item class="row q-gutter-y-md" v-if="entityKey === 'SITE'" style="flex-wrap: wrap">
      <app-skeleton-directory-item-list
        v-for="index in 14"
        :key="index"
        class="col-12 col-sm-6 col-md-3 col-lg-3"
      />
    </q-item>

    <div v-if="entityKey !== 'SITE'" class="q-pa-sm">
      <div class="row q-col-gutter-sm">
        <app-skeleton-card v-for="index in 2" :key="index" class="col-md-3 col-sm-4 col-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Constants

  import { EntityURLKey } from "@/constants";
  import AppSkeletonCard from "./app-skeleton-card.vue";
  import AppSkeletonCarousel from "./app-skeleton-carousel.vue";
  import AppSkeletonChips from "./app-skeleton-chips.vue";
  import AppSkeletonSearch from "./app-skeleton-search.vue";
  import AppSkeletonWeather from "./app-skeleton-weather.vue";
  import AppSkeletonDirectoryItemList from "./app-skeleton-directory-item-list.vue";
  import AppSkeletonToolbar from "./app-skeleton-toolbar.vue";

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();
</script>
