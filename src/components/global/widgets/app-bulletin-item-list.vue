<template>
  <template v-if="sortedItemsWithType.length > 0">
    <div class="row q-col-gutter-sm">
      <div
        v-for="(item, index) in sortedItemsWithType"
        :key="index"
        :class="entityKey == 'COMMUNITY_EVENT' ? 'col-md-3 col-sm-4 col-6' : ''"
      >
        <event-card v-if="entityKey == 'COMMUNITY_EVENT'" :item="item" />
        <notice-card v-else-if="entityKey == 'COMMUNITY_NOTICE'" :item="item" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="text-h6 text-center q-pa-md text-grey-6 text-weight-bold">
      {{ $t("errors.noRecord") }}
    </div>
  </template>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Components
  import NoticeCard from "@/components/card/notice-card.vue";
  import EventCard from "@/components/card/event-card.vue";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Props
  const { items, entityKey } = defineProps<{
    items: CategoryTypes[];
    entityKey: EntityURLKey;
  }>();

  // Modify the sortedItemsWithType computation
  const sortedItemsWithType = computed(() => {
    const temp = [...items];
    const sortedArray = temp.slice().sort((a, b) => {
      const keyA = new Date(a.createdAt).getTime();
      const keyB = new Date(b.createdAt).getTime();

      return keyB - keyA; // Descending order, latest date first
    });

    return sortedArray || [];
  });
</script>
