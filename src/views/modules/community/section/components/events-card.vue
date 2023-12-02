<template>
  <q-card>
    <q-img :ratio="16 / 9" :src="computeImagePath(events?.imagePath)" />

    <q-card-section class="q-pa-sm">
      <app-item dense icon="schedule" :label="eventTime(events)" />
      <app-item dense icon="location_on" :label="events?.subtitle1" />
    </q-card-section>

    <q-card-actions>
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
    events: {
      type: Object as PropType<Business>,
      required: true
    }
  });

  const emit = defineEmits(["on-click"]);

  const eventTime = (row: Business) => {
    // Check if modifiedAt is undefined or null, provide a default value
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DDT09:00");

    return modifiedAt;
  };

  function onItemClick() {
    emit("on-click", props.events);
  }

  function computeImagePath(imagePath: any) {
    return imagePath ? `${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }
</script>
