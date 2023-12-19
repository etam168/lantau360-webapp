<template>
  <q-card>
    <q-img :ratio="16 / 9" :src="computeImagePath(item.bannerPath)" />

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
  import { CommunityEvent } from "@/interfaces/models/entities/community-event";
  import { BLOB_URL } from "@/constants";
  import { useQuasar } from "quasar";

  const $q = useQuasar();

  const props = defineProps({
    item: {
      type: Object as PropType<CommunityEvent>,
      required: true
    }
  });

  const onItemClick = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/event-detail-dialog.vue")),
      componentProps: {
        query: { communityEventId: props.item.communityEventId }
      }
    });
  };

  function computeImagePath(imagePath: string | null) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : "/no_image_available.jpeg";
  }
</script>
