<template>
  <q-card flat square class="q-gutter-y-md">
    <template v-for="(item, index) in renderItems" :key="index">
      <app-skeleton-carousel v-if="item.type === 'carousel'" />
      <app-skeleton-search v-else-if="item.type === 'search'" />
      <app-skeleton-tab-items v-else-if="item.type === 'tabItems'" :item-count="item.itemCount" />
      <app-skeleton-weather v-else-if="item.type === 'weather'" />

      <!-- <q-item v-else-if="item.type === 'chips'" class="q-px-md q-gutter-sm">
      <app-skeleton-chips v-for="chips in 3" :key="chips" />
    </q-item>

    <q-item v-else-if="item.type === 'directory'" class="row q-gutter-y-md" style="flex-wrap: wrap">
      <app-skeleton-directory-item-list
        v-for="index in 14"
        :key="index"
        class="col-12 col-sm-6 col-md-3 col-lg-3"
      />
    </q-item>

    <div v-else-if="item.type === 'cards'" class="q-pa-sm">
      <div class="row q-col-gutter-sm">
        <app-skeleton-card v-for="index in 2" :key="index" class="col-md-3 col-sm-4 col-6" />
      </div>
    </div> -->
    </template>
  </q-card>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { EntityURLKey } from "@/constants";

  interface RenderItem {
    name: string;
    itemCount?: number;
    type:
      | "carousel"
      | "toolbar"
      | "weather"
      | "search"
      | "chips"
      | "directory"
      | "cards"
      | "tabItems";
  }

  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const renderItems = computed((): RenderItem[] => {
    switch (entityKey) {
      case "BUSINESS":
        return [
          { name: "carousel", type: "carousel" },
          { name: "toolbar", type: "toolbar" },
          { name: "cards", type: "cards" }
        ];
      case "SITE":
        return [
          { name: "carousel", type: "carousel" },
          { name: "weather", type: "weather" },
          { name: "tabItems", type: "tabItems", itemCount: 3 },
          { name: "search", type: "search" },
          { name: "directory", type: "directory" }
        ];
      default:
        return [];
    }
  });
</script>
