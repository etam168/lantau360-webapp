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
          <q-item v-if="renderer !== RENDERER.TIMETABLE" class="q-items-center q-pa-none">
            <gallery-carousel-image
              class="col-12 q-items-center"
              :gallery-images="galleryItems"
              :address="translate(item.subtitle1, item.meta, 'subtitle1')"
            />
          </q-item>

          <site-content v-if="renderer === RENDERER.SITE" :item="item as Site" />
          <business-content v-else-if="renderer === RENDERER.BUSINESS" :item="item as Business" />
          <timetable-content v-else-if="renderer === RENDERER.TIMETABLE" :item="item as Site" />
          <posting-content v-else-if="renderer === RENDERER.POSTING" :item="item as Posting" />
          <taxi-content v-else-if="renderer === RENDERER.TAXI" :item="item as Site" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import axios, { AxiosError } from "axios";
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";
  import { Business } from "@/interfaces/models/entities/business";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { Site } from "@/interfaces/models/entities/site";

  // .ts files
  import { URL, RENDERER } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";
  import { EventBus } from "quasar";

  // Custom Components
  import BusinessContent from "@/components/dialog/renderer/business-content.vue";
  import PostingContent from "@/components/dialog/renderer/posting-content.vue";
  import SiteContent from "@/components/dialog/renderer/site-content.vue";
  import TaxiContent from "@/components/dialog/renderer/taxi-content.vue";
  import TimetableContent from "@/components/dialog/renderer/timetable-content.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const eventBus = new EventBus();
  const { translate } = useUtilities();
  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImageType[]>([]);

  const dialogTitle = computed(() => {
    switch (true) {
      case "siteId" in props.item:
        return translate(props.item.siteName, props.item.meta, "siteName");
      case "businessId" in props.item:
        return translate(props.item.businessName, props.item.meta, "businessName");
      case "postingId" in props.item:
        return translate(props.item.title, props.item.meta, "title");
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
      case "postingId" in props.item:
        return `${URL.POSTING_GALLERY}/${props.item.postingId}`;
      default:
        return "";
    }
  });

  const renderer = computed(() => {
    switch (true) {
      case "siteId" in props.item && props.item.directoryId == 24:
        return RENDERER.TIMETABLE;
      case "siteId" in props.item && props.item.directoryId == 26:
        return RENDERER.TAXI;
      case "siteId" in props.item:
        return RENDERER.SITE;
      case "businessId" in props.item:
        return RENDERER.BUSINESS;
      case "postingId" in props.item:
        return RENDERER.POSTING;
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
