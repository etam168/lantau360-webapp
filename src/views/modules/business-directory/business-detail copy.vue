<template>
  <q-dialog
    ref="dialogRef"
    maximized
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card class="bg-grey-4">
      <q-item class="q-items-center">
        <gallery-images-component
          class="col-md-8 q-items-center"
          style="max-height: 600px"
          :gallery-images="galleryItems"
        />
      </q-item>

      <q-item>
        <q-icon name="location_on" size="2em" color="primary" />
        <q-item-label class="q-mt-sm">{{ directoryItem.subtitle1 }}</q-item-label>
      </q-item>

      <q-item>
        <q-btn color="primary" text-color="white" icon="location_on" round />
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
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { BUSINESS_GALLERY_URL, BUSINESS_URL, DIRECTORY_GROUPS, STORAGE_KEYS } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import axios, { AxiosError } from "axios";
  import { PropType, onMounted } from "vue";
  import { ref } from "vue";
  //import { useRouter } from "vue-router";
  import { LocalStorage } from "quasar";
  import { Business } from "@/interfaces/models/entities/business";

  // 3rd Party Import
  import { useDialogPluginComponent } from "quasar";

  import eventBus from "@/utils/event-bus";

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  const props = defineProps({
    row: {
      type: Object as PropType<any>,
      required: true
    }
  });

  //const router = useRouter();
  const directoryItem = ref<Business>({} as Business);
  const error = ref<string | null>(null);
  //const { query } = router.currentRoute.value;
  const galleryItems = ref<GalleryImage[]>([]);

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);

  const isFavourite = ref<boolean>(false);
  const isDialogVisible = ref();

  const onBtnFavClick = () => {
    const itemIdToMatch = directoryItem.value.businessId;
    const isCurrentlyFavourite = isFavourite.value;

    if (isCurrentlyFavourite) {
      const itemIndex = favoriteItems.value.findIndex((item: any) => item.itemId === itemIdToMatch);

      if (itemIndex !== -1) {
        favoriteItems.value.splice(itemIndex, 1);
      }

      isFavourite.value = false;
    } else {
      const favItem = {
        directoryId: props?.row.businessId,
        //directoryName: directoryItem.value.directoryName,
        itemName: directoryItem.value.title,
        itemId: itemIdToMatch,
        groupId: DIRECTORY_GROUPS.BUSINESS,
        iconPath: directoryItem.value.iconPath,
        subTitle: directoryItem.value.subtitle1
      };

      isFavourite.value = true;
      favoriteItems.value.push(favItem);
    }
    LocalStorage.set(STORAGE_KEYS.FAVOURITES, favoriteItems.value);
  };

  onMounted(() => {
    loadData();

    eventBus.on("CloseDilaog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, true);
  }

  const loadData = async () => {
    if (props?.row.businessId !== undefined) {
      try {
        const [businessResponse, galleryResponse] = await Promise.all([
          axios.get(`${BUSINESS_URL}/${props?.row?.businessId}`),
          axios.get<GalleryImage[]>(`${BUSINESS_GALLERY_URL}/${props?.row.businessId}`)
        ]);
        directoryItem.value = businessResponse.data;
        galleryItems.value = galleryResponse.data;

        isFavourite.value =
          (favoriteItems?.value ?? []).find(
            (item: any) => item.itemId == directoryItem.value.businessId
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
