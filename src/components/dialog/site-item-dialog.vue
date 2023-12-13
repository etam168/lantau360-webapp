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
          <q-item class="q-items-center q-pa-xs">
            <gallery-carousel-image
              class="col-12 q-items-center"
              :gallery-images="galleryItems"
              :address="translate(directoryItem.subtitle1, directoryItem.meta, 'subtitle1')"
            />
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
            <q-item-section>
              <q-item-label class="q-mt-sm"
                >{{ translate(directoryItem.subtitle1, directoryItem.meta, "subtitle1") }}
              </q-item-label>
              <q-item-label class="q-mt-sm" caption>{{ $t("home.subtitle1") }} </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator class="q-mt-sm" />

          <q-item>
            <div
              v-html="translate(directoryItem.description, directoryItem.meta, 'description')"
            ></div>
          </q-item>
          <q-separator class="q-mt-sm" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { SITE_GALLERY_URL, SITE_URL, STORAGE_KEYS } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { useDialogPluginComponent } from "quasar";
  import { PropType, computed, onMounted } from "vue";
  import { ref } from "vue";

  import { LocalStorage } from "quasar";
  import { Site } from "@/interfaces/models/entities/site";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

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
  const galleryItems = ref<GalleryImage[]>([]);
  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.SITEFAVOURITES) || []);

  const isFavourite = ref<boolean>(false);
  const onBtnFavClick = () => {
    const itemIdToMatch = directoryItem.value.siteId;
    const isCurrentlyFavourite = isFavourite.value;

    if (isCurrentlyFavourite) {
      const itemIndex = favoriteItems.value.findIndex((item: any) => item.siteId === itemIdToMatch);
      if (itemIndex !== -1) {
        favoriteItems.value.splice(itemIndex, 1);
      }

      isFavourite.value = false;
    } else {
      const favItem: Site = {
        siteId: props.query?.siteId,
        directoryName: directoryItem?.value?.directoryName,
        siteName: directoryItem.value.siteName,
        iconPath: directoryItem.value.iconPath,
        contactWhatsApp: directoryItem.value.contactWhatsApp,
        contactPhone: directoryItem.value.contactPhone,
        contactOther: directoryItem.value.contactOther,
        buttonText: directoryItem.value.buttonText,
        title: directoryItem.value.title,
        subtitle1: directoryItem.value.subtitle1,
        subtitle2: directoryItem.value.subtitle2,
        subtitle3: directoryItem.value.subtitle3,
        displayMask: directoryItem.value.displayMask,
        description: directoryItem.value.description,
        directoryId: directoryItem.value.directoryId,
        imagePath: directoryItem.value.imagePath,
        bannerPath: directoryItem.value.bannerPath,
        hashKey: directoryItem.value.hashKey,
        latitude: directoryItem.value.latitude,
        longitude: directoryItem.value.longitude,
        createdAt: directoryItem.value.createdAt,
        createdBy: directoryItem.value.createdBy,
        modifiedAt: directoryItem.value.modifiedAt,
        modifiedBy: directoryItem.value.modifiedBy,
        meta: directoryItem.value.meta
      };
      isFavourite.value = true;
      favoriteItems.value.push(favItem);
    }

    LocalStorage.set(STORAGE_KEYS.SITEFAVOURITES, favoriteItems.value);
    eventBus.emit("favoriteUpdated", {
      siteId: directoryItem.value.siteId,
      isFavorite: isFavourite.value
    });
  };

  const temp = () => {
    alert(JSON.stringify(favoriteItems.value));
  };

  const dialogTitle = computed(() => {
    return translate(directoryItem.value.siteName, directoryItem.value.meta, "siteName");
  });

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
            (item: any) => item.siteId == directoryItem.value.siteId
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
