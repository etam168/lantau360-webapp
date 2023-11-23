<template>
  <q-item class="q-items-center">
    <gallery-images-component
      class="col-md-8 q-items-center"
      style="max-height: 600px"
      :gallery-images="galleryItems"
    />
  </q-item>

  <q-item>
    <q-icon name="location_on" size="2em" color="blue" />
    <q-item-label class="q-mt-sm">{{ directoryItem.subtitle1 }}</q-item-label>
  </q-item>

  <q-item>
    <q-btn color="primary" text-color="white" icon="location_on" round />
    <q-space />

    <q-btn color="primary" text-color="white" icon="phone" round />
    <q-space />
    <q-btn color="primary" text-color="white" icon="favorite" round />
  </q-item>
  <q-separator class="q-mt-sm" />

  <q-item>
    <div v-html="directoryItem.description"></div>
  </q-item>
  <q-separator class="q-mt-sm" />
</template>

<script setup lang="ts">
  import { SITE_GALLERY_URL, SITE_URL } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { onMounted } from "vue";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import GalleryImagesComponent from "./gallery-images/index.vue";

  const router = useRouter();
  const directoryItem = ref<any>({} as any);
  const error = ref<string | null>(null);
  const { query } = router.currentRoute.value;
  const galleryItems = ref<GalleryImage[]>([]);

  onMounted(() => {
    loadData();
  });

  const loadData = async () => {
    if (query?.directoryItemId !== undefined) {
      try {
        const [siteResponse, galleryResponse] = await Promise.all([
          axios.get(`${SITE_URL}/${query?.directoryItemId}`),
          axios.get<GalleryImage[]>(`${SITE_GALLERY_URL}/${query?.directoryItemId}`)
        ]);
        directoryItem.value = siteResponse.data;
        galleryItems.value = galleryResponse.data;
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
    }
  };
</script>
