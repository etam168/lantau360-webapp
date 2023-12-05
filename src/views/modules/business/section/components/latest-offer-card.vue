<template>
  <q-card class="my-card">
    <q-img :ratio="16 / 9" :src="computeImagePath(offers?.imagePath)" />

    <q-card-section class="q-pa-sm">
      <app-item dense icon="location_on" :label="offers?.subtitle1" />
      <app-item dense icon="schedule" :label="computeBusinessHours(offers)" />
    </q-card-section>

    <q-card-actions>
      <q-space />
      <q-btn
        outline
        dense
        color="primary"
        label="More Details"
        class="full-width"
        @click="onItemClick()"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";
  import { Business } from "@/interfaces/models/entities/business";
  import { date } from "quasar";

  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  import AppItem from "@/components/widgets/app-item.vue";

  const props = defineProps({
    offers: {
      type: Object as PropType<Business>,
      required: true
    }
  });

  const emit = defineEmits(["on-click"]);

  const computeBusinessHours = (row: Business) => {
    const datePart = date.formatDate(Date.now(), "YYYY-MM-DDT");

    // Check if openTime and closeTime are undefined or null, provide default values
    const openTime = row.openTime
      ? Date.parse(datePart + row.openTime)
      : Date.parse(datePart + "09:00");
    const closeTime = row.closeTime
      ? Date.parse(datePart + row.closeTime)
      : Date.parse(datePart + "17:00");

    return `${date.formatDate(openTime, "HH:mm")} - ${date.formatDate(closeTime, "HH:mm")}`;
  };

  function onItemClick() {
    emit("on-click", props.offers);
  }

  function computeImagePath(imagePath: any) {
    return imagePath ? `${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }
</script>
