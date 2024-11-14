<template>
  <div :class="hasCommunityItems(items) ? 'row q-col-gutter-sm' : 'q-gutter-y-md'">
    <div
      v-for="(item, index) in sortedItemsWithType"
      :key="index"
      :class="isCommunityEvent(item) ? 'col-md-3 col-sm-4 col-6' : ''"
    >
      <event-card v-if="isCommunityEvent(item)" :item="item" />
      <notice-card v-else-if="isCommunityNotice(item)" :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Custom Components
  import NoticeCard from "@/components/card/notice-card.vue";
  import EventCard from "@/components/card/event-card.vue";

  // Props
  const { items } = defineProps<{ items: CategoryTypes[] }>();

  const { isCommunityNotice, isCommunityEvent } = useUtilities();

  const hasCommunityItems = (items: any) => {
    return items.some(
      (item: CategoryTypes) =>
        (isCommunityNotice(item) && item.communityNoticeId !== undefined) ||
        (isCommunityEvent(item) && item.communityEventId !== undefined)
    );
  };

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
