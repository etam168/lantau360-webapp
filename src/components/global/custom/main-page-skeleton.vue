<template>
  <q-card flat square class="q-gutter-y-md">
    <template v-for="(item, index) in renderItems" :key="index">
      <app-skeleton-carousel v-if="item.type === 'carousel'" />
      <app-skeleton-search v-else-if="item.type === 'search'" />
      <app-skeleton-tab-items v-else-if="item.type === 'tabItems'" :item-count="item.itemCount" />
      <app-skeleton-weather v-else-if="item.type === 'weather'" />
      <app-skeleton-directory-items
        v-else-if="item.type === 'directory'"
        :item-count="item.itemCount"
      />
      <app-skeleton-toolbar v-else-if="item.type === 'toolbar'" :item-count="item.itemCount" />
      <app-skeleton-card v-else-if="item.type === 'cards'" :item-count="item.itemCount" />
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
    entityKey?: EntityURLKey;
  }>();

  const renderItems = computed((): RenderItem[] => {
    switch (entityKey) {
      case "BUSINESS":
        return [
          { name: "carousel", type: "carousel" },
          { name: "toolbar", type: "toolbar", itemCount: 2 },
          { name: "cards", type: "cards", itemCount: 2 }
        ];
      case "COMMUNITY":
        return [
          { name: "carousel", type: "carousel" },
          { name: "toolbar", type: "toolbar", itemCount: 3 },
          { name: "cards", type: "cards", itemCount: 1 }
        ];
      case "FAVOURITE":
        return [
          { name: "carousel", type: "carousel" },
          { name: "toolbar", type: "toolbar", itemCount: 2 }
        ];
      case "SITE":
        return [
          { name: "carousel", type: "carousel" },
          { name: "weather", type: "weather" },
          { name: "tabItems", type: "tabItems", itemCount: 3 },
          { name: "search", type: "search" },
          { name: "directory", type: "directory", itemCount: 14 }
        ];
      default:
        return [];
    }
  });
</script>
