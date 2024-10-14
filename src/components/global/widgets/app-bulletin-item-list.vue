<template>
  <div :class="hasCommunityItems(items) ? 'row q-col-gutter-sm' : 'q-gutter-y-md'">
    <div v-for="(item, index) in sortedItemsWithType" :key="index" class="col-md-3 col-sm-4 col-6">
      <!-- <news-card v-if="isCommunityNews(item)" :item="item" /> -->
      <event-card v-if="isCommunityEvent(item)" :item="item" />
      <notice-card v-else-if="isCommunityNotice(item)" :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";

  // Custom Components
  import NoticeCard from "@/components/card/notice-card.vue";
  // import NewsCard from "@/components/card/news-card.vue";
  import EventCard from "@/components/card/event-card.vue";

  // Define props for this component

  // Props
  const { items } = defineProps<{
    items: BulletinTypes[];
  }>();

  const { isCommunityNotice, isCommunityEvent } = useUtilities();

  const hasCommunityItems = (items: any) => {
    return items.some(
      (item: BulletinTypes) =>
        // (isCommunityNews(item) && item.communityNewsId !== undefined) ||
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
