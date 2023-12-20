<template>
  <q-card>
    <q-img :ratio="16 / 9" :src="imagePath" />

    <q-card-section class="q-pa-sm">
      <!-- <app-item dense icon="schedule" :label="eventTime(offers)" />
      <app-item dense icon="location_on" :label="offers?.subtitle1" /> -->
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
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";
  import { CommunityEvent } from "@/interfaces/models/entities/community-event";

  import { BLOB_URL } from "@/constants";
  import { useQuasar } from "quasar";

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const $q = useQuasar();

  const onItemClick = (item: CommunityEvent) => {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/event-detail-dialog.vue")),
      componentProps: {
        item: item
      }
    });
  };

  const imagePath = computed(() => {
    return props.item.bannerPath
      ? `${BLOB_URL}/${props.item.bannerPath}`
      : "/no_image_available.jpeg";
  });
</script>
