<template>
  <q-item clickable @click="onItemClick(data)">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="computePath(itemImage)" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ noticeTime(data?.date) }}</q-item-label>
      <q-item-label
        ><q-badge color="primary" class="text-white"> {{ data?.title }} </q-badge></q-item-label
      >
      <q-item-label caption lines="2">{{ data?.description }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
  // Vue Import

  import { BLOB_URL, COMMUNITY_NOTICE_GALLERY_URL } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { CommunityNotice } from "@/interfaces/models/entities/community-notice";
  import { PropType, defineAsyncComponent, onMounted, ref } from "vue";
  import { date, useQuasar } from "quasar";

  const props = defineProps({
    data: {
      type: Object as PropType<CommunityNotice>,
      required: true
    }
  });

  const $q = useQuasar();
  const error = ref<string | null>(null);
  const itemImage = ref();

  const noticeTime = (row: any) => {
    // Check if row is null or undefined
    if (row === null || row === undefined) {
      return ""; // Return an empty string or any default value if row is null or undefined
    }

    // Check if modifiedAt is present in the row object
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DD");

    return modifiedAt;
  };

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("../dialog/notice-detail-dialog.vue")),
      componentProps: {
        query: { communityNoticeId: item.communityNoticeId }
      }
    });
  }

  onMounted(() => {
    loadData();
  });

  const loadData = async () => {
    try {
      const [galleryResponse] = await Promise.all([
        axios.get<GalleryImage[]>(`${COMMUNITY_NOTICE_GALLERY_URL}/${props.data.communityNoticeId}`)
      ]);

      itemImage.value = galleryResponse.data[0].imagePath;
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
