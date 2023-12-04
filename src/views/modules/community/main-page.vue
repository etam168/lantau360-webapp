<template>
  <q-card-actions align="center">
    <div class="text-h6 text-weight-medium">{{ $t("community.title") }}</div>
  </q-card-actions>

  <promotion-section :data="promotions" />

  <q-toolbar class="text-white bg-grey-3">
    <q-chip
      v-for="(tabItem, index) in tabItems"
      :key="index"
      :outline="tab !== tabItem.name"
      color="primary"
      text-color="white"
      clickable
      @click="setTab(tabItem.name)"
    >
      {{ tabItem.label }}
    </q-chip>
  </q-toolbar>

  <q-tab-panels
    v-model="tab"
    animated
    transition-prev="fade"
    transition-next="fade"
    transition-duration="1000"
  >
    <q-tab-panel name="news">
      <news-section :data="newsData" class="q-mb-md" />
    </q-tab-panel>

    <q-tab-panel name="events">
      <events-section :events="eventData" class="q-mb-md" />
    </q-tab-panel>

    <q-tab-panel name="notice">
      <notice-section :data="notifications" class="q-mb-md" />
    </q-tab-panel>

    <q-tab-panel name="directory">
      <directories-section :data="directoriesData" class="q-mb-md" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useI18n } from "vue-i18n";

  // .ts file
  import {
    COMMUNITY_DIRECTORY,
    COMMUNITY_EVENT,
    COMMUNITY_NEWS,
    COMMUNITY_NOTICE,
    PROMOTION_URL
  } from "@/constants";

  import DirectoriesSection from "./section/directories-section.vue";
  import EventsSection from "./section/events-section.vue";
  import NewsSection from "./section/news-section.vue";
  import NoticeSection from "./section/notice-section.vue";
  import PromotionSection from "./section/promotion-section.vue";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { CommunityEvent } from "@/interfaces/models/entities/communityEvent";
  import { CommunityNews } from "@/interfaces/models/entities/communityNews";

  const { t } = useI18n({ useScope: "global" });
  const promotions = ref<any | null>(null);
  const directoriesData = ref();
  const latestOffers = ref();
  const eventData = ref();
  const newsData = ref();
  const notifications = ref();
  const tab = ref("news");

  const error = ref<string | null>(null);

  const tabItems = ref([
    { name: "news", label: t("community.tabItems.news") },
    { name: "events", label: t("community.tabItems.events") },
    { name: "notice", label: t("community.tabItems.notice") },
    { name: "directory", label: t("community.tabItems.directory") }
  ]);

  function setTab(val: string) {
    tab.value = val;
  }

  try {
    const [respPromotions, respLatestOffers, respEvent, respDirectories, respNews, respNotice] =
      await Promise.all([
        axios.get(`${PROMOTION_URL}/108`),
        axios.get(`${PROMOTION_URL}/100`),
        axios.get<CommunityEvent>(`${COMMUNITY_EVENT}`),
        axios.get<Directory>(`${COMMUNITY_DIRECTORY}`),
        axios.get<CommunityNews>(`${COMMUNITY_NEWS}`),
        axios.get<CommunityNews>(`${COMMUNITY_NOTICE}`)
      ]);
    promotions.value = respPromotions.data.data;
    latestOffers.value = respLatestOffers.data.data;
    eventData.value = respEvent.data;
    directoriesData.value = respDirectories.data;
    newsData.value = respNews.data;
    notifications.value = respNotice.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.status === 404) {
        error.value = "Not found";
      } else {
        error.value = "An error occurred";
      }
    } else {
      error.value = "An unexpected error occurred";
    }
  }

  // const newsArray = ref([
  //   {
  //     date: "2023-12-01",
  //     title: "Exciting News Announcement",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  //   },
  //   {
  //     date: "2023-11-30",
  //     title: "New Feature Release",
  //     description:
  //       "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  //   },
  //   {
  //     date: "2023-11-29",
  //     title: "Company Milestone Achieved",
  //     description:
  //       "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  //   },
  //   {
  //     date: "2023-11-28",
  //     title: "Upcoming Event Preview",
  //     description:
  //       "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  //   },
  //   {
  //     date: "2023-11-27",
  //     title: "Product Update Details",
  //     description:
  //       "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
  //   },
  //   {
  //     date: "2023-11-26",
  //     title: "Industry Recognition Received",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  //   },
  //   {
  //     date: "2023-11-25",
  //     title: "Team Member Spotlight",
  //     description:
  //       "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  //   },
  //   {
  //     date: "2023-11-24",
  //     title: "Community Engagement Initiative",
  //     description:
  //       "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  //   },
  //   {
  //     date: "2023-11-23",
  //     title: "New Partnership Announcement",
  //     description:
  //       "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
  //   },
  //   {
  //     date: "2023-11-22",
  //     title: "Company Values Refinement",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  //   }
  // ]);

  // const notifications = ref([
  //   {
  //     date: "2023-12-01T08:30:00",
  //     title: "New Message Received",
  //     description: "You have a new message from a friend."
  //   },
  //   {
  //     date: "2023-11-30T15:45:00",
  //     title: "Event Reminder",
  //     description: "Don't forget about the upcoming event tomorrow."
  //   },
  //   {
  //     date: "2023-11-29T12:00:00",
  //     title: "Task Deadline Approaching",
  //     description: "The deadline for your task is approaching. Finish it on time!"
  //   },
  //   {
  //     date: "2023-11-28T09:15:00",
  //     title: "Weather Alert",
  //     description: "Severe weather warning in your area. Stay safe!"
  //   },
  //   {
  //     date: "2023-11-27T18:00:00",
  //     title: "New Feature Announcement",
  //     description: "Exciting new features have been added to your favorite app."
  //   },
  //   {
  //     date: "2023-11-26T14:30:00",
  //     title: "Daily Check-In Reminder",
  //     description: "Don't forget to complete your daily check-in."
  //   },
  //   {
  //     date: "2023-11-25T11:45:00",
  //     title: "Meeting Tomorrow",
  //     description: "You have an important meeting scheduled for tomorrow. Be prepared!"
  //   },
  //   {
  //     date: "2023-11-24T16:20:00",
  //     title: "Payment Received",
  //     description: "You received a payment for your recent transaction."
  //   },
  //   {
  //     date: "2023-11-23T13:10:00",
  //     title: "Product Sale Notification",
  //     description: "One of your products has been sold. Check the details."
  //   },
  //   {
  //     date: "2023-11-22T10:00:00",
  //     title: "Upcoming Holiday",
  //     description: "Plan your activities for the upcoming holiday."
  //   }
  // ]);
</script>
