<template>
  <q-item clickable @click="onItemClick(data)">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="computePath(data?.imagePath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ newsTime(data) }}</q-item-label>
      <q-item-label>{{ data?.communityNewsName }}</q-item-label>
      <q-item-label caption lines="2"> <div v-html="data?.description"></div></q-item-label>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
  // Vue Import
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { CommunityNews } from "@/interfaces/models/entities/communityNews";
  import { PropType, defineAsyncComponent } from "vue";
  import { date, useQuasar } from "quasar";

  defineProps({
    data: {
      type: Object as PropType<CommunityNews>
    }
  });

  const $q = useQuasar();

  const newsTime = (row: CommunityNews) => {
    // Check if modifiedAt is undefined or null, provide a default value
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DDT09:00");

    return modifiedAt;
  };

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("../news-detail-dialog.vue")),
      componentProps: {
        query: { communityNewsId: item.communityNewsId }
      }
    });
  }

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : PLACEHOLDER_THUMBNAIL;
  };
</script>
