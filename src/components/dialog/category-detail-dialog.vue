<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" container class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <div
            v-if="renderer !== RENDERER.TIMETABLE && renderer !== RENDERER.EMERGENCY"
            class="q-items-center q-pa-none"
          >
            <gallery-image-list :image-list="galleryItems" />
          </div>

          <atm-renderer
            v-if="renderer === RENDERER.ATM"
            :item="item"
            :isFavourite="isFavourite"
            :gallery-images="galleryImagesCompleteList"
            @on-favourite="onBtnFavClick"
          />
          <site-renderer
            v-else-if="renderer === RENDERER.SITE"
            :item="item"
            :isFavourite="isFavourite"
            :gallery-images="galleryImagesCompleteList"
            @on-favourite="onBtnFavClick"
          />
          <business-renderer
            v-else-if="renderer === RENDERER.BUSINESS"
            :item="item"
            :isFavourite="isFavourite"
            :gallery-images="galleryImagesCompleteList"
            @on-favourite="onBtnFavClick"
          />
          <timetable-renderer
            v-else-if="renderer === RENDERER.TIMETABLE"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <taxi-renderer
            v-else-if="renderer === RENDERER.TAXI"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <daytrip-renderer
            v-else-if="renderer === RENDERER.DAYTRIP"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <emergency-renderer
            v-else-if="renderer === RENDERER.EMERGENCY"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <restaurant-renderer
            v-else-if="renderer === RENDERER.RESTAURANT"
            :item="item"
            :gallery-images="galleryImagesCompleteList"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
            >YES</restaurant-renderer
          >
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { LocalStorage, useDialogPluginComponent } from "quasar";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // .ts files
  import { URL, RENDERER, TEMPLATE, STORAGE_KEYS } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";

  // Custom Components
  import AtmRenderer from "@/components/dialog/renderer/atm-renderer.vue";
  import BusinessRenderer from "@/components/dialog/renderer/business-renderer/index.vue";
  import DaytripRenderer from "@/components/dialog/renderer/daytrip-renderer.vue";
  import EmergencyRenderer from "@/components/dialog/renderer/emergency-renderer.vue";
  import SiteRenderer from "@/components/dialog/renderer/site-renderer/index.vue";
  import TaxiRenderer from "@/components/dialog/renderer/taxi-renderer.vue";
  import TimetableRenderer from "@/components/dialog/renderer/timetable-renderer.vue";
  import RestaurantRenderer from "@/components/dialog/renderer/restaurant-renderer.vue";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { BusinessView } from "@/interfaces/models/views/business-view";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { translate, eventBus } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const { t } = useI18n({ useScope: "global" });

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImageType[]>([]);
  const galleryImagesCompleteList = ref<GalleryImageType[]>([]);

  const dialogTitle = computed(() => {
    switch (true) {
      case "siteId" in props.item:
        return translate(props.item.siteName, props.item.meta, "siteName");
      case "businessId" in props.item:
        return translate(props.item.businessName, props.item.meta, "businessName");
      default:
        return "";
    }
  });

  const galleryUrl = computed(() => {
    switch (true) {
      case "siteId" in props.item:
        return `${URL.SITE_GALLERY}/${props.item.siteId}`;
      case "businessId" in props.item:
        return `${URL.BUSINESS_GALLERY}/${props.item.businessId}`;
      default:
        return "";
    }
  });

  const favoriteSiteItems = ref(
    (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[]
  );
  const favoriteBusinessItems = ref(
    (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[]
  );

  const isFavourite = computed(() => {
    if ("siteId" in props.item) {
      const favItems = favoriteSiteItems.value;
      const item = props.item as SiteView;
      return useArraySome(favItems, fav => fav.siteId == item.siteId).value;
    } else if ("businessId" in props.item) {
      const favItems = favoriteBusinessItems.value;
      const item = props.item as BusinessView;
      return useArraySome(favItems, fav => fav.businessId == item.businessId).value;
    }
  });

  const onBtnFavClick = () => {
    if ("siteId" in props.item) {
      const item = props.item as SiteView;
      const index = favoriteSiteItems.value.findIndex(fav => fav.siteId === item.siteId);

      if (isFavourite.value) {
        if (index !== -1) {
          favoriteSiteItems.value.splice(index, 1);
        }
      } else {
        favoriteSiteItems.value.push(item);
      }

      LocalStorage.set(STORAGE_KEYS.SAVED.SITE, favoriteSiteItems.value);
    } else if ("businessId" in props.item) {
      const item = props.item as BusinessView;
      const index = favoriteBusinessItems.value.findIndex(
        fav => fav.businessId === item.businessId
      );

      if (isFavourite.value) {
        if (index !== -1) {
          favoriteBusinessItems.value.splice(index, 1);
        }
      } else {
        favoriteBusinessItems.value.push(item);
      }

      LocalStorage.set(STORAGE_KEYS.SAVED.BUSINESS, favoriteBusinessItems.value);
    }

    eventBus.emit("favoriteUpdated", props.item);
  };

  const renderer = computed(() => {
    switch (true) {
      case props.item.directoryTemplate == TEMPLATE.ATM.value:
        return RENDERER.ATM;
      case props.item.directoryTemplate == TEMPLATE.TIMETABLE.value:
        return RENDERER.TIMETABLE;
      case props.item.directoryTemplate == TEMPLATE.TAXI.value:
        return RENDERER.TAXI;
      case props.item.directoryTemplate == TEMPLATE.RESTAURANT.value:
        return RENDERER.RESTAURANT;
      case props.item.directoryTemplate == TEMPLATE.DAYTRIP.value:
        return RENDERER.DAYTRIP;
      case props.item.directoryTemplate == TEMPLATE.EMERGENCY.value:
        return RENDERER.EMERGENCY;
      case "siteId" in props.item && props.item.directoryTemplate == TEMPLATE.DEFAULT.value:
        return RENDERER.SITE;
      case "businessId" in props.item && props.item.directoryTemplate == TEMPLATE.DEFAULT.value:
        return RENDERER.BUSINESS;
      default:
        return "";
    }
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
    if (galleryUrl.value) {
      try {
        const [galleryResponse] = await Promise.all([
          axios.get<GalleryImageType[]>(galleryUrl.value)
        ]);

        galleryImagesCompleteList.value = galleryResponse.data;
        galleryImagesCompleteList.value.sort((a, b) => a.ranking - b.ranking);

        const maskValue = getMaskValue(props.item.directoryTemplate || 0);
        galleryItems.value = galleryResponse.data
          .filter(element => !((maskValue >> (element.ranking - 1)) & 1))
          .sort((a, b) => a.ranking - b.ranking);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response && err.response.status === 404) {
            error.value = t("errors.404");
          } else {
            error.value = t("errors.anErrorOccured");
          }
        } else {
          error.value = t("errors.anErrorOccured");
        }
      }
    }
  };

  function getMaskValue(templateValue: number, meta?: any) {
    for (const make in TEMPLATE) {
      if (TEMPLATE[make as keyof typeof TEMPLATE].value === templateValue) {
        const modifier = meta?.["hasMap"] === true ? 2 : 0;
        return TEMPLATE[make as keyof typeof TEMPLATE].mask + modifier;
      }
    }
    return 0;
  }

  // function getMaskValue(templateValue: number) {
  //   for (const make in TEMPLATE) {
  //     if (TEMPLATE[make as keyof typeof TEMPLATE].value === templateValue) {
  //       return TEMPLATE[make as keyof typeof TEMPLATE].mask;
  //     }
  //   }
  //   return 0;
  // }
</script>
