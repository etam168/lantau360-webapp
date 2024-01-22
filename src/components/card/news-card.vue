<template>
  <q-item clickable @click="throttledHandleDialog">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img :ratio="1" :src="imagePath" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ newsTime(newsItem) }}</q-item-label>
      <q-item-label>{{ newsItem?.communityNewsName }}</q-item-label>
      <q-item-label caption lines="2"> <div v-html="newsItem?.description"></div></q-item-label>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
  // Quasar Import
  import { date, throttle, useQuasar } from "quasar";

  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";
  import { CommunityNews } from "@/interfaces/models/entities/community-news";

  // .ts files
  import { BLOB_URL } from "@/constants";

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const $q = useQuasar();
  const newsItem = computed(() => props.item as CommunityNews);

  const newsTime = (row: CommunityNews) => {
    // Check if modifiedAt is undefined or null, provide a default value
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DDT09:00");

    return modifiedAt;
  };

  function onItemClick() {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/bulletin-detail-dialog.vue")
      ),
      componentProps: {
        item: props.item
      }
    });
  }

  const imagePath = computed(() => {
    return newsItem.value.iconPath
      ? `${BLOB_URL}/${newsItem.value.iconPath}`
      : "./img/icons/no_image_available.jpeg";
  });

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
