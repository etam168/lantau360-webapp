<template>
  <q-toolbar class="q-pr-md" v-if="statusText">
    <div>
      <span :class="statusClass" class="q-pr-sm text-subtitle1">{{ statusText }}</span>
      <q-icon :name="fasCircle" class="q-mr-sm" style="font-size: 0.8em" />
      {{ formattedTimes }}
    </div>
    <q-space />

    <app-button-rounded
      :text-color="isFavourite ? 'red' : 'white'"
      :icon="fasHeart"
      @click="onBtnFavClick"
    />
  </q-toolbar>
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Constants
  import { EntityURLKey } from "@/constants";
  import { fasCircle, fasHeart } from "@quasar/extras/fontawesome-v6";

  // Stores
  import { useFavoriteStore } from "@/stores/favorite-store";
  import { useUserStore } from "@/stores/user";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const favoriteStore = useFavoriteStore();
  const userStore = useUserStore();

  // Computed properties
  const isFavourite = computed(() => favoriteStore.isBusinessFavorite(category as BusinessView));

  // Utility function to format time to 12-hour format with am/pm
  function formatTime(time: string): string {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  // Computed property for the status text ("Open now" or "Close now")
  const statusText = computed(() => {
    if (!(category as BusinessView).openTime || !category.closeTime) {
      return "";
    }

    const currentTime = new Date();
    const openTime = new Date();
    const closeTime = new Date();

    const [openHour, openMinute] = category.openTime.split(":");
    const [closeHour, closeMinute] = category.closeTime.split(":");

    openTime.setHours(Number(openHour), Number(openMinute));
    closeTime.setHours(Number(closeHour), Number(closeMinute));

    // Return "Open now" or "Close now" based on the time
    if (currentTime >= openTime && currentTime < closeTime) {
      return "Open now";
    } else {
      return "Close now";
    }
  });

  // Computed property for formatted times
  const openTime = computed(() => {
    if (!category.openTime || !category.closeTime) {
      return "";
    }
  });

  const formattedTimes = computed(() => {
    if (!category.openTime || !category.closeTime) {
      return "";
    }
    return `${formatTime(category.openTime)} - ${formatTime(category.closeTime)}`;
  });

  // Computed property for Quasar class binding based on status
  const statusClass = computed(() => {
    if (statusText.value === "Open now") {
      return "text-primary"; // Quasar class for primary color (e.g., blue)
    } else {
      return "text-red"; // Quasar class for red text
    }
  });

  function onBtnFavClick() {
    switch (true) {
      case !userStore.isUserLogon():
        userStore.promptUserLogon();
        break;
      case entityKey === "BUSINESS":
        favoriteStore.toggleBusinessFavorite(category as BusinessView, isFavourite.value);
        break;
    }
  }
</script>
