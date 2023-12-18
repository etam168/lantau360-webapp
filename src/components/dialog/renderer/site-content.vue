<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section avatar>
        <q-icon color="primary" name="location_on" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="q-mt-sm"
          >{{ translate(directoryItem.subtitle1, directoryItem.meta, "subtitle1") }}
        </q-item-label>
        <q-item-label class="q-mt-sm" caption>{{ $t("community.subtitle1") }} </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            color="primary"
            :text-color="isFavourite ? 'red' : 'white'"
            icon="favorite"
            size="sm"
            round
            @click="onBtnFavClick"
            class="q-mr-md" />
          <q-btn color="primary" text-color="white" icon="phone" size="sm" round class="q-mr-md" />
          <q-btn color="primary" text-color="white" icon="fab fa-whatsapp" size="sm" round
        /></q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-mt-sm" />

    <q-item>
      <div v-html="translate(directoryItem.description, directoryItem.meta, 'description')"></div>
    </q-item>
    <q-separator class="q-mt-sm" />
  </q-list>
</template>
<script setup lang="ts">
  import axios, { AxiosError } from "axios";
  import { PropType, computed, onMounted } from "vue";
  import { ref } from "vue";
  import { LocalStorage } from "quasar";
  import { SITE_GALLERY_URL, SITE_URL, STORAGE_KEYS } from "@/constants";
  import { Site } from "@/interfaces/models/entities/site";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  const directoryItem = ref<Site>({} as Site);
  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<Site>,
      required: true
    }
  });

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImage[]>([]);
  const isFavourite = ref<boolean>(false);

  const favoriteItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as Site[];
  });

  const onBtnFavClick = () => {
    const itemIdToMatch = directoryItem.value.siteId;

    if (itemIdToMatch) {
      const isCurrentlyFavourite = isFavourite.value;

      if (isCurrentlyFavourite) {
        const itemIndex = favoriteItems.value.findIndex(
          (item: any) => item.siteId === itemIdToMatch || item.businessId === itemIdToMatch
        );

        if (itemIndex !== -1) {
          favoriteItems.value.splice(itemIndex, 1);
        }

        isFavourite.value = false;
      } else {
        isFavourite.value = true;
        favoriteItems.value.push(props.item);
      }

      const storageKey = STORAGE_KEYS.SITEFAVOURITES;
      LocalStorage.set(storageKey, favoriteItems.value);

      eventBus.emit("favoriteUpdated", {
        siteId: directoryItem.value.siteId || null
      });
    }
  };

  onMounted(async () => {
    try {
      const [categoryResponse, galleryResponse] = await Promise.all([
        axios.get(`${SITE_URL}/${props.item.siteId}`),
        axios.get<GalleryImage[]>(`${SITE_GALLERY_URL}/${props.item.siteId}`)
      ]);

      directoryItem.value = categoryResponse.data;
      galleryItems.value = galleryResponse.data;

      isFavourite.value =
        (favoriteItems?.value ?? []).find(
          (item: any) => props.item.siteId && item.siteId === directoryItem.value.siteId
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
  });
</script>
