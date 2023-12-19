<template>
  <q-item clickable @click="onItemClick(item)">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="computePath(item.iconPath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ newsTime(item) }}</q-item-label>
      <q-item-label>{{ item?.communityNewsName }}</q-item-label>
      <q-item-label caption lines="2"> <div v-html="item?.description"></div></q-item-label>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
  // Vue Import
  import { BLOB_URL } from "@/constants";
  import { CommunityNews } from "@/interfaces/models/entities/community-news";
  import { PropType, defineAsyncComponent } from "vue";
  import { date, useQuasar } from "quasar";

  defineProps({
    item: {
      type: Object as PropType<CommunityNews>,
      required: true
    }
  });

  const $q = useQuasar();

  const newsTime = (row: any) => {
    // Check if modifiedAt is undefined or null, provide a default value
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DDT09:00");

    return modifiedAt;
  };

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/news-detail-dialog.vue")),
      componentProps: {
        query: { communityNewsId: item.communityNewsId }
      }
    });
  }
  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };
</script>
