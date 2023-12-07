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
    <q-card style="max-width: 1024px">
      <q-layout view="hHh lpR fFf">
        <q-card-actions align="center" class="button-margin">
          <q-btn dense flat icon="arrow_back" v-close-popup> </q-btn>
          <q-space />
          <!-- <div class="text-h6 text-weight-medium">{{ directoryItem }}</div> -->
          <div class="text-h6 text-weight-medium">
            {{ translate(directoryItem.title, directoryItem.meta, "title") }}
          </div>
          <q-space />
        </q-card-actions>

        <q-page-container class="q-mx-sm q-pa-none">
          <q-item class="q-items-center q-pa-xs">
            <gallery-images-component
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
          d
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
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { DIRECTORY_GROUPS, POSTING_GALLERY_URL, POSTING_URL, STORAGE_KEYS } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { useDialogPluginComponent } from "quasar";
  import { PropType, onMounted } from "vue";
  import { ref } from "vue";
  //import { useRouter } from "vue-router";

  import GalleryImagesComponent from "@/components/custom/gallery-images/index.vue";

  import { LocalStorage } from "quasar";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  //const router = useRouter();
  const directoryItem = ref<Posting>({} as Posting);
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
    const itemIdToMatch = directoryItem.value.postingId;
    const isCurrentlyFavourite = isFavourite.value;

    if (isCurrentlyFavourite) {
      const itemIndex = favoriteItems.value.findIndex((item: any) => item.itemId === itemIdToMatch);
      if (itemIndex !== -1) {
        favoriteItems.value.splice(itemIndex, 1);
      }

      isFavourite.value = false;
    } else {
      const favItem = {
        directoryId: props.query?.postingId,
        directoryName: directoryItem?.value?.directoryName,
        itemName: directoryItem.value.postingName,
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

  // const translateTitle = computed(() => {
  //   const { locale } = useI18n({ useScope: "global" });
  //   switch (locale.value) {
  //     case "hk":
  //       return props.data.meta?.i18n?.hk?.["directoryName"] ?? props.data.directoryName;
  //     case "cn":
  //       return props.data.meta?.i18n?.cn?.["directoryName"] ?? props.data.directoryName;
  //     default:
  //       return props.data.directoryName;
  //   }
  // });
  onMounted(() => {
    loadData();
    eventBus.on("CommunityDetailDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CommunityDetailDialog");
  }

  const loadData = async () => {
    if (props.query?.postingId !== undefined) {
      try {
        const [postingResponse, galleryResponse] = await Promise.all([
          axios.get(`${POSTING_URL}/${props.query?.postingId}`),
          axios.get<GalleryImage[]>(`${POSTING_GALLERY_URL}/${props.query?.postingId}`)
        ]);
        directoryItem.value = postingResponse.data;
        galleryItems.value = galleryResponse.data;

        isFavourite.value =
          (favoriteItems?.value ?? []).find(
            (item: any) => item.itemId == directoryItem.value.postingId
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
