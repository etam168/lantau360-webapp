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
  {{ isFavourite }}

  <q-item>
    <q-btn color="primary" text-color="white" icon="location_on" round @click="temp" />
    <q-space />

    <q-btn color="primary" text-color="white" icon="phone" round />
    <q-space />
    <q-btn
      color="primary"
      :text-color="isFavourite ? 'red' : 'white'"
      icon="favorite"
      round
      @click="onBtnFavClick"
    />
  </q-item>
  <q-separator class="q-mt-sm" />

  <q-item>
    <div v-html="directoryItem.description"></div>
  </q-item>
  <q-separator class="q-mt-sm" />
</template>

<script setup lang="ts">
  import { SITE_GALLERY_URL, SITE_URL, STORAGE_KEYS } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { onMounted } from "vue";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import GalleryImagesComponent from "./gallery-images/index.vue";
  import { LocalStorage } from "quasar";
  import { Site } from "@/interfaces/site";

  const router = useRouter();
  const directoryItem = ref<Site>({} as Site);

  const error = ref<string | null>(null);
  const { query } = router.currentRoute.value;
  const galleryItems = ref<GalleryImage[]>([]);
  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES));
  const isFavourite = ref<boolean>(false);

  const onBtnFavClick = () => {
    favoriteItems.value = favoriteItems.value || [];

    const itemIdToMatch = directoryItem.value.siteId;
    const isCurrentlyFavourite = isFavourite.value;

    if (isCurrentlyFavourite) {
      const itemIndex = favoriteItems.value.findIndex((item: any) => item.itemId === itemIdToMatch);

      if (itemIndex !== -1) {
        favoriteItems.value.splice(itemIndex, 1);
      }

      isFavourite.value = false;
    } else {
      const favItem = {
        directoryId: query?.directoryItemId,
        directoryName: query?.directoryName,
        itemName: directoryItem.value.siteName,
        itemId: itemIdToMatch,
        groupId: 1,
        iconPath: directoryItem.value.iconPath,
        subTitle: directoryItem.value.subtitle1
      };

      isFavourite.value = true;
      favoriteItems.value.push(favItem);
      LocalStorage.set(STORAGE_KEYS.FAVOURITES, favoriteItems);
    }
  };

  const temp = () => {
    alert(JSON.stringify(favoriteItems.value));
  };

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

        isFavourite.value =
          (favoriteItems?.value ?? []).find(
            (item: any) => item.itemId == directoryItem.value.siteId
          ) != null;
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
