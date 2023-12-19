<template>
  <q-card>
    <q-img :ratio="16 / 9" :src="computeImagePath" />

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

  const eventItem = computed(() => props.item as CommunityEvent);
  const $q = useQuasar();

  const onItemClick = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/event-detail-dialog.vue")),
      componentProps: {
        query: { communityEventId: eventItem.value.communityEventId }
      }
    });
  };

  const computeImagePath = computed(() => {
    return props.item.bannerPath
      ? `${BLOB_URL}/${props.item.bannerPath}`
      : "/no_image_available.jpeg";
  });
</script>
