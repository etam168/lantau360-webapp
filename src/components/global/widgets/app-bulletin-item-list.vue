<template>
  <div :class="isCommunityEvent(props.items[0]) ? 'row q-col-gutter-sm' : 'q-gutter-y-md'">
    <div v-for="(item, index) in sortedItemsWithType" :key="index" class="col-md-3 col-sm-4 col-6">
      <news-card v-if="isCommunityNews(item)" :item="item" />
      <notice-card v-else-if="isCommunityNotice(item)" :item="item" />
      <event-card v-else-if="isCommunityEvent(item)" :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";

  // Custom Components
  import NoticeCard from "@/components/card/notice-card.vue";
  import NewsCard from "@/components/card/news-card.vue";
  import EventCard from "@/components/card/event-card.vue";

  // Define props for this component
  const props = defineProps({
    items: {
      type: Array as PropType<BulletinTypes[]>,
      required: true
    }
  });

  const { isCommunityNews, isCommunityNotice, isCommunityEvent } = useUtilities();

  // Modify the sortedItemsWithType computation
  const sortedItemsWithType = computed(() => {
    const temp = [...props.items];
    const sortedArray = temp.slice().sort((a, b) => {
      const keyA = new Date(a.createdAt).getTime();
      const keyB = new Date(b.createdAt).getTime();

      return keyB - keyA; // Descending order, latest date first
    });

    return sortedArray || [];
  });
</script>
