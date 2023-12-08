<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-list padding class="q-mx-sm q-pa-none">
            <q-item class="q-items-center">
              <gallery-carousel-image
                class="col-12 q-items-center"
                style="max-height: 600px"
                :gallery-images="galleryItems"
              />
            </q-item>
            <q-item>
              <q-icon name="location_on" size="2em" color="blue" />
              <q-item-label class="q-mt-sm"
                >{{ translate(directoryItem.subtitle1, directoryItem.meta, "subtitle1") }}
              </q-item-label>
            </q-item>

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
              <div
                v-html="translate(directoryItem.description, directoryItem.meta, 'description')"
              ></div>
            </q-item>
            <q-separator class="q-mt-sm" />
          </q-list>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import {
    DIRECTORY_GROUPS,
    ADVERTISEMENT_GALLERY_URL,
    ADVERTISEMENT_DETAIL_URL,
    STORAGE_KEYS
  } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { useDialogPluginComponent } from "quasar";
  import { PropType, computed, onMounted } from "vue";
  import { ref } from "vue";
  //import { useRouter } from "vue-router";

  import { LocalStorage } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  import { Advertisement } from "@/interfaces/models/entities/advertisement";
  import eventBus from "@/utils/event-bus";

  //const router = useRouter();
  const directoryItem = ref<Advertisement>({} as Advertisement);
  const { translate } = useUtilities();

  const props = defineProps({
    query: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const error = ref<string | null>(null);
  // const { query } = router.currentRoute.value;
  const galleryItems = ref<GalleryImage[]>([]);
  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);

  const isFavourite = ref<boolean>(false);
  const onBtnFavClick = () => {
    const itemIdToMatch = directoryItem.value.advertisementId;
    const isCurrentlyFavourite = isFavourite.value;

    if (isCurrentlyFavourite) {
      const itemIndex = favoriteItems.value.findIndex((item: any) => item.itemId === itemIdToMatch);
      if (itemIndex !== -1) {
        favoriteItems.value.splice(itemIndex, 1);
      }

      isFavourite.value = false;
    } else {
      const favItem = {
        directoryId: props.query?.advertisementId,
        directoryName: directoryItem?.value?.directoryName,
        itemName: directoryItem.value.advertisementName,
        itemId: itemIdToMatch,
        groupId: DIRECTORY_GROUPS.HOME,
        iconPath: directoryItem.value.iconPath,
        subTitle: directoryItem.value.subtitle1
      };

      isFavourite.value = true;
      favoriteItems.value.push(favItem);
    }
    LocalStorage.set(STORAGE_KEYS.FAVOURITES, favoriteItems.value);
  };

  const temp = () => {
    alert(JSON.stringify(favoriteItems.value));
  };

  const dialogTitle = computed(() => {
    return translate(
      directoryItem.value.advertisementName,
      directoryItem.value.meta,
      "advertisementName"
    );
  });

  onMounted(() => {
    loadData();
    eventBus.on("CommunityAdsDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CommunityAdsDialog");
  }

  const loadData = async () => {
    if (props.query?.advertisementId !== undefined) {
      try {
        const [advertisementResponse, galleryResponse] = await Promise.all([
          axios.get(`${ADVERTISEMENT_DETAIL_URL}/${props.query?.advertisementId}`),
          axios.get<GalleryImage[]>(`${ADVERTISEMENT_GALLERY_URL}/${props.query?.advertisementId}`)
        ]);
        directoryItem.value = advertisementResponse.data;
        galleryItems.value = galleryResponse.data;

        isFavourite.value =
          (favoriteItems?.value ?? []).find(
            (item: any) => item.itemId == directoryItem.value.advertisementId
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
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
