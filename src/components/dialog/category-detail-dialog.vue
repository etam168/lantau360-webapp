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
          <q-item class="q-items-center q-pa-none">
            <gallery-carousel-image
              class="col-12 q-items-center"
              :gallery-images="galleryItems"
              :address="translate(directoryItem.subtitle1, directoryItem.meta, 'subtitle1')"
            />
          </q-item>
          <q-list padding class="q-mx-sm q-pa-none">
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
                <q-item-label class="q-mt-sm" caption
                  >{{ $t("community.subtitle1") }}
                </q-item-label>
              </q-item-section>
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
  import axios, { AxiosError } from "axios";
  import { PropType, computed, onMounted } from "vue";
  import { ref } from "vue";
  import { useDialogPluginComponent, LocalStorage } from "quasar";

  import {
    BUSINESS_GALLERY_URL,
    BUSINESS_URL,
    POSTING_GALLERY_URL,
    POSTING_URL,
    SITE_GALLERY_URL,
    SITE_URL,
    STORAGE_KEYS
  } from "@/constants";

  import { Business } from "@/interfaces/models/entities/business";
  import { Site } from "@/interfaces/models/entities/site";

  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  type CategoryTypes = Business | Site;

  const directoryItem = ref<CategoryTypes>({} as CategoryTypes);
  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImage[]>([]);

  const favoriteItems = computed(() => {
    switch (true) {
      case "siteId" in props.item:
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as Site[];
      case "businessId" in props.item:
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as Business[];
      default:
        return [];
    }
  });

  const isFavourite = ref<boolean>(false);
  const onBtnFavClick = () => {
    let itemIdToMatch: any = null;
    switch (true) {
      case "siteId" in props.item:
        itemIdToMatch = directoryItem.value.siteId;
        break;
      case "businessId" in props.item:
        itemIdToMatch = directoryItem.value.businessId;
        break;
      default:
        itemIdToMatch = null;
    }

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
        const favItem: CategoryTypes = {
          ...(props.item as CategoryTypes)
        };

        isFavourite.value = true;
        favoriteItems.value.push(favItem);
      }

      let storageKey: string = "";

      switch (true) {
        case "siteId" in props.item:
          storageKey = STORAGE_KEYS.SITEFAVOURITES;
          break;
        case "businessId" in props.item:
          storageKey = STORAGE_KEYS.BUSINESSFAVOURITES;
          break;
        default:
          storageKey = "";
      }

      LocalStorage.set(storageKey, favoriteItems.value);

      eventBus.emit("favoriteUpdated", {
        siteId: directoryItem.value.siteId || null,
        businessId: directoryItem.value.businessId || null,
        isFavorite: isFavourite.value
      });
    }
  };

  const temp = () => {
    alert(JSON.stringify(favoriteItems.value));
  };

  const dialogTitle = computed(() => {
    return translate(
      props.item.siteName || props.item.businessName || props.item.postingName,
      directoryItem.value.meta,
      "siteName" || "businessName" || "postingName"
    );
  });

  onMounted(() => {
    loadData();
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryDetailDialog");
  }

  const loadData = async () => {
    let apiUrl: string = "";
    let galleryUrl: string = "";

    switch (true) {
      case "siteId" in props.item:
        apiUrl = `${SITE_URL}/${props.item.siteId}`;
        galleryUrl = `${SITE_GALLERY_URL}/${props.item.siteId}`;
        break;
      case "businessId" in props.item:
        apiUrl = `${BUSINESS_URL}/${props.item.businessId}`;
        galleryUrl = `${BUSINESS_GALLERY_URL}/${props.item.businessId}`;
        break;
      case "postingId" in props.item:
        apiUrl = `${POSTING_URL}/${props.item.postingId}`;
        galleryUrl = `${POSTING_GALLERY_URL}/${props.item.postingId}`;
        break;
      default:
        apiUrl = "";
        galleryUrl = "";
    }

    if (apiUrl && galleryUrl) {
      try {
        const [categoryResponse, galleryResponse] = await Promise.all([
          axios.get(apiUrl),
          axios.get<GalleryImage[]>(galleryUrl)
        ]);

        directoryItem.value = categoryResponse.data;
        galleryItems.value = galleryResponse.data;

        isFavourite.value =
          (favoriteItems?.value ?? []).find(
            (item: any) =>
              (props.item.siteId && item.siteId === directoryItem.value.siteId) ||
              (props.item.businessId && item.businessId === directoryItem.value.businessId) ||
              (props.item.postingId && item.postingId === directoryItem.value.postingId)
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
