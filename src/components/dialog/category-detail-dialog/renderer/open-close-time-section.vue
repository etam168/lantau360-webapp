<template>
  <q-item class="q-px-md q-pb-none" v-if="statusText">
    <q-item-section class="justify-center">
      <q-item-label class="q-pa-none q-ma-none">
        <span :class="statusClass" class="q-pr-sm text-subtitle1">{{ statusText }}</span>
        <q-icon :name="fasCircle" class="q-mr-sm" style="font-size: 0.8em" />
        {{ formattedTimes }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { fasCircle } from "@quasar/extras/fontawesome-v6";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{ category: CategoryTypes }>();

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
    if (!category.openTime || !category.closeTime) {
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

  // Computed property for the icon to display (check or close icon)

  // Computed property for formatted times
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
</script>
