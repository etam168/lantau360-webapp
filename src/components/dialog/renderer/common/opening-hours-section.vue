<template>
  <q-item class="q-pa-none">
    <q-item-section>
      <q-item-label class="q-pa-none q-ma-none" v-if="shouldShowItem">
        <span
          class="text-subtitle1"
          :style="{
            color: isCurrentTimeInRange(businessItem.openTime, businessItem.closeTime)
              ? '#478d45'
              : 'red'
          }"
        >
          {{
            isCurrentTimeInRange(businessItem.openTime, businessItem.closeTime)
              ? "Open now"
              : "Close now"
          }}
        </span>
        <q-icon size="0.9em" name="fiber_manual_record" />
        {{ formatTime(businessItem.openTime) }} -
        {{ formatTime(businessItem.closeTime) }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const businessItem = computed(() => props?.item as BusinessView);

  const shouldShowItem = computed(() => {
    return (
      businessItem.value.openTime !== null &&
      businessItem.value.openTime !== undefined &&
      businessItem.value.openTime !== "" &&
      businessItem.value.closeTime !== null &&
      businessItem.value.closeTime !== undefined &&
      businessItem.value.closeTime !== ""
    );
  });

  function isCurrentTimeInRange(
    startTime: string | undefined,
    endTime: string | undefined
  ): boolean {
    if (!startTime || !endTime) return false;

    const now = new Date();
    const startHour = parseInt(startTime.split(":")[0]);
    const startMinute = parseInt(startTime.split(":")[1]);
    const endHour = parseInt(endTime.split(":")[0]);
    const endMinute = parseInt(endTime.split(":")[1]);

    const startTimeToday = new Date();
    startTimeToday.setHours(startHour, startMinute, 0);

    const endTimeToday = new Date();
    endTimeToday.setHours(endHour, endMinute, 0);

    // If the end time is earlier than the start time, assume it's for the next day
    if (endTimeToday < startTimeToday) {
      endTimeToday.setDate(endTimeToday.getDate() + 1);
    }

    return now >= startTimeToday && now <= endTimeToday;
  }

  function formatTime(time: string | undefined) {
    if (!time) return "";

    const parsedTime = new Date(`2000-01-01T${time}`);
    const formattedTime = parsedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return formattedTime;
  }
</script>
