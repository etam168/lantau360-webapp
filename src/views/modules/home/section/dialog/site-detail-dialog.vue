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
            {{ translate(directoryItem.siteName, directoryItem.meta, "siteName") }}
          </div>
          <q-space />
        </q-card-actions>

        <q-page-container class="q-mx-sm q-pa-none">
          <q-item class="q-items-center q-pa-xs">
            <gallery-carousel-image
              class="col-12 q-items-center"
              style="max-height: 600px"
              :gallery-images="galleryItems"
              :address="translate(directoryItem.subtitle1, directoryItem.meta, 'subtitle1')"
            />
          </q-item>
          <q-item>
            <!-- <q-icon name="location_on" size="2em" color="blue" />
            <q-item-label class="q-mt-sm"
              >{{ translate(directoryItem.subtitle1, directoryItem.meta, "subtitle1") }}
            </q-item-label> -->
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
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { DIRECTORY_GROUPS, SITE_GALLERY_URL, SITE_URL, STORAGE_KEYS } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { useDialogPluginComponent } from "quasar";
  import { PropType, onMounted } from "vue";
  import { ref } from "vue";
  //import { useRouter } from "vue-router";

  // import GalleryImagesComponent from "@/components/custom/gallery-images/index.vue";

  import { LocalStorage } from "quasar";
  import { Site } from "@/interfaces/models/entities/site";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  //const router = useRouter();
  const directoryItem = ref<Site>({} as Site);
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
        directoryId: props.query?.siteId,
        directoryName: directoryItem?.value?.directoryName,
        itemName: directoryItem.value.siteName,
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
    eventBus.on("SiteDetailDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "SiteDetailDialog");
  }

  const loadData = async () => {
    if (props.query?.siteId !== undefined) {
      try {
        const [siteResponse, galleryResponse] = await Promise.all([
          axios.get(`${SITE_URL}/${props.query?.siteId}`),
          axios.get<GalleryImage[]>(`${SITE_GALLERY_URL}/${props.query?.siteId}`)
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
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
