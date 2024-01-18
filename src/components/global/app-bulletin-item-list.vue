<template>
  <div :class="containerClass" class="q-gutter-y-md">
    <div v-for="(item, index) in sortedItemsWithType" :key="index" :class="itemClass(item.type)">
      <news-card v-if="item.type === BULLETIN.NEWS" :item="item.value" />
      <notice-card v-else-if="item.type === BULLETIN.NOTICE" :item="item.value" />
      <event-card v-else-if="item.type === BULLETIN.EVENT" :item="item.value" />
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const BULLETIN = {
    EVENT: "Event",
    NEWS: "News",
    NOTICE: "Notice"
  };

  function getItemType(item: BulletinTypes) {
    switch (true) {
      case "communityEventId" in item:
        return BULLETIN.EVENT;
      case "communityNewsId" in item:
        return BULLETIN.NEWS;
      case "communityNoticeId" in item:
        return BULLETIN.NOTICE;
      default:
        return "";
    }
  }

  const itemClass = (itemType: string) => {
    switch (itemType) {
      case BULLETIN.NEWS:
        return "col-md-3 col-sm-4 col-6";
      case BULLETIN.NOTICE:
        return "col-md-3 col-sm-4 col-6";
      case BULLETIN.EVENT:
        return "col-md-3 col-sm-4 col-6";
      default:
        return "";
    }
  };

  const containerClass = computed(() => ({
    row: itemsWithType.value.some(item => item.type === BULLETIN.EVENT),
    column: !itemsWithType.value.some(item => item.type === BULLETIN.EVENT),
    "q-col-gutter-sm": itemsWithType.value.some(item => item.type === BULLETIN.EVENT)
  }));

  // Computed property to transform items into key/value pairs
  const itemsWithType = computed(() => {
    return props.items.map(item => ({
      value: item,
      type: getItemType(item)
    }));
  });

  const getSortingKey = (item: BulletinTypes) => {
    if ("communityNoticeName" in item) {
      return item.communityNoticeName?.toLowerCase() || "";
    } else if ("communityEventName" in item) {
      return item.communityEventName?.toLowerCase() || "";
    } else if ("communityNewsName" in item) {
      return item.communityNewsName?.toLowerCase() || "";
    }

    // default case, or handle other types as needed
    return "";
  };

  const sortedItemsWithType = computed(() => {
    const sortedArray = itemsWithType.value.slice().sort((a, b) => {
      const keyA = getSortingKey(a.value);
      const keyB = getSortingKey(b.value);

      return keyA.localeCompare(keyB, undefined, { sensitivity: "base" });
    });

    return sortedArray;
  });
</script>
