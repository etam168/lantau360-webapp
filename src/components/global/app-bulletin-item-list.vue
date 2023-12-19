<template>
  <div class="column q-gutter-y-md">
    <div v-for="(item, index) in items" :key="getItemType(item)" class="col-md-3 col-sm-4 col-6">
      <!-- <div>{{ key }}</div> -->
      <component :is="getComponentType(item)" v-bind="getComponentProps(item)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  // ts files
  import { CommunityEvent } from "@/interfaces/models/entities/community-event";
  import { CommunityNews } from "@/interfaces/models/entities/community-news";
  import { CommunityNotice } from "@/interfaces/models/entities/community-notice";

  // Custom Components
  import NoticeCard from "@/components/card/notice-card.vue";
  import NewsCard from "@/components/card/news-card.vue";
  import EventCard from "@/components/card/event-card.vue";

  type BulletinTypes = CommunityEvent | CommunityNotice | CommunityNews;

  // Define props for this component
  defineProps({
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

  function getItemType(item: BulletinTypes): "notice" | "news" | "event" {
    if ("communityNoticeId" in item) return "notice";
    if ("communityNewsId" in item) return "news";
    if ("communityEventId" in item) return "event";
    throw new Error("Unknown item type");
  }

  function getComponentType(item: BulletinTypes) {
    switch (getItemType(item)) {
      case "notice":
        return NoticeCard;
      case "news":
        return NewsCard;
      case "event":
        return EventCard;
      default:
        throw new Error("Unknown item type");
    }
  }

  // const renderer = computed(() => {
  //   switch (true) {
  //     case "communityNoticeId" in props.item:
  //       return RENDERER.SITE;
  //     case "businessId" in props.item:
  //       return RENDERER.BUSINESS;
  //     case "postingId" in props.item:
  //       return RENDERER.POSTING;
  //     default:
  //       return "";
  //   }
  // });

  // function getItemKey(item: BulletinTypes): number {
  //   switch (getItemType(item)) {
  //     case "notice":
  //       return (item as CommunityNotice).communityNoticeId;
  //     case "news":
  //       return (item as CommunityNews).communityNewsId;
  //     default:
  //       return -1;
  //   }
  // }

  function getComponentProps(item: BulletinTypes) {
    if ("communityNoticeId" in item) {
      return { item: item as CommunityNotice };
    } else if ("communityNewsId" in item) {
      return { item: item as CommunityNews };
    } else if ("communityEventId" in item) {
      return { item: item as CommunityEvent };
    }
    throw new Error("Unknown item type");
  }
</script>
