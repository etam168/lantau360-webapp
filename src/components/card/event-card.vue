<template>
  <q-card>
    <q-img :ratio="11 / 8" :src="imagePath" />

    <q-card-actions>
      <q-btn
        outline
        dense
        color="primary"
        label="More Details"
        class="full-width"
        @click="onItemClick"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";

  // .ts files
  import { BLOB_URL } from "@/constants";
  import { CommunityEventView } from "@/interfaces/models/views/community-event-view";

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const $q = useQuasar();
  const eventItem = computed(() => props.item as CommunityEventView);
  const onItemClick = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/bulletin-detail-dialog.vue")
      ),
      componentProps: {
        item: props.item
      }
    });
  };

  const imagePath = computed(() => {
    return eventItem.value.bannerPath
      ? `${BLOB_URL}/${eventItem.value.bannerPath}`
      : "./img/icons/no_image_available.jpeg";
  });
</script>
