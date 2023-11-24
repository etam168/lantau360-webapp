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
    <q-btn color="primary" text-color="white" icon="favorite" round @click="onBtnFavClick" />˝
  </q-item>
  <q-separator class="q-mt-sm" />

  <q-item>
    <div v-html="directoryItem.description"></div>
  </q-item>
  <q-separator class="q-mt-sm" />
</template>

<script setup lang="ts">
  import { BUSINESS_GALLERY_URL, BUSINESS_URL, STORAGE_KEYS } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { onMounted } from "vue";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import GalleryImagesComponent from "./gallery-images/index.vue";
  import { Favourite } from "@/interfaces/models/Favourite";
  import { LocalStorage } from "quasar";

  const router = useRouter();
  const directoryItem = ref<any>({} as any);
  const error = ref<string | null>(null);
  const { query } = router.currentRoute.value;
  const galleryItems = ref<GalleryImage[]>([]);

  const favoriteItems = ref<Favourite | any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES));

  const onBtnFavClick = () => {
    favoriteItems.value ??= {};
    favoriteItems.value.business ??= {};
    favoriteItems.value.business.directoryId ??= [];
    favoriteItems.value.business.directoryId.push(directoryItem.value.siteId);
    LocalStorage.set(STORAGE_KEYS.FAVOURITES, favoriteItems);
  };

  onMounted(() => {
    loadData();
  });

  const loadData = async () => {
    if (query?.directoryItemId !== undefined) {
      try {
        const [siteResponse, galleryResponse] = await Promise.all([
          axios.get(`${BUSINESS_URL}/${query?.directoryItemId}`),
          axios.get<GalleryImage[]>(`${BUSINESS_GALLERY_URL}/${query?.directoryItemId}`)
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
