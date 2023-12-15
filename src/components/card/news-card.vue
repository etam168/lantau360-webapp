<template>
  <q-item clickable @click="onItemClick(item)">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="computePath(itemImage)" />
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
  import { BLOB_URL, COMMUNITY_NEWS_GALLERY_URL } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { CommunityNews } from "@/interfaces/models/entities/community-news";
  import { PropType, defineAsyncComponent, onMounted, ref } from "vue";
  import { date, useQuasar } from "quasar";

  const props = defineProps({
    item: {
      type: Object as PropType<CommunityNews>
    }
  });

  const $q = useQuasar();
  const error = ref<string | null>(null);
  const itemImage = ref();

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

  onMounted(() => {
    loadData();
  });

  const loadData = async () => {
    try {
      const [galleryResponse] = await Promise.all([
        axios.get<GalleryImage[]>(`${COMMUNITY_NEWS_GALLERY_URL}/${props.item?.communityNewsId}`)
      ]);

      itemImage.value = galleryResponse.item[0].imagePath;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          error.value = "Not found";
        } else {
          error.value = "An error occurred";
        }
      } else {
        error.value = "An unexpected error occurred";
      }
    }
  };

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };
</script>
