<template>
  <div class="column q-gutter-y-md">
    <div v-for="item in items" :key="getItemKey(item)" class="col-md-3 col-sm-4 col-6">
      <component :is="getComponentType(item)" v-bind="getComponentProps(item)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  // ts files
  import { CommunityNotice } from "@/interfaces/models/entities/community-notice";
  import { CommunityNews } from "@/interfaces/models/entities/community-news";

  // Custom Components
  import NoticeCard from "@/components/card/notice-card.vue";
  import NewsCard from "@/components/card/news-card.vue";

  type BulletinType = CommunityNotice | CommunityNews;

  // Define props for this component
  defineProps({
    items: {
      type: Array as PropType<BulletinType[]>,
      required: true
    }
  });

  function getItemType(item: BulletinType): "notice" | "news" {
    if ("communityNoticeId" in item) return "notice";
    if ("communityNewsId" in item) return "news";
    throw new Error("Unknown item type");
  }

  function getComponentType(item: BulletinType) {
    switch (getItemType(item)) {
      case "notice":
        return NoticeCard;
      case "news":
        return NewsCard;
      default:
        throw new Error("Unknown item type");
    }
  }

  function getItemKey(item: BulletinType): number {
    switch (getItemType(item)) {
      case "notice":
        return (item as CommunityNotice).communityNoticeId;
      case "news":
        return (item as CommunityNews).communityNewsId;
      default:
        return -1;
    }
  }

  function getComponentProps(item: BulletinType) {
    if ("communityNoticeId" in item) {
      return { item: item as CommunityNotice };
    } else if ("communityNewsId" in item) {
      return { item: item as CommunityNews };
    }
    throw new Error("Unknown item type");
  }
</script>
