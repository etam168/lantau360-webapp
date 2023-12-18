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
              :address="translate(item.subtitle1, item.meta, 'subtitle1')"
            />
          </q-item>

          <div v-if="contentType === 'SITE'"><site-content :item="item as Site" /></div>
          <div v-else-if="contentType === 'TAXI'">Taxi</div>
          <div v-else-if="contentType === 'TIMETABLE'">Timetable</div>
          <div v-else-if="contentType === 'BUSINESS'">Business</div>
          <div v-else-if="contentType === 'POSTING'">Posting</div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import axios, { AxiosError } from "axios";
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { Business } from "@/interfaces/models/entities/business";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { Site } from "@/interfaces/models/entities/site";

  // .ts files
  import { BUSINESS_GALLERY_URL, POSTING_GALLERY_URL, SITE_GALLERY_URL } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  //Custom components
  import SiteContent from "./renderer/site-content.vue";

  type CategoryTypes = Business | Site | Posting;

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
        return `${SITE_GALLERY_URL}/${props.item.siteId}`;
      case "businessId" in props.item:
        return `${BUSINESS_GALLERY_URL}/${props.item.businessId}`;
      case "postingId" in props.item:
        return `${POSTING_GALLERY_URL}/${props.item.postingId}`;
      default:
        return "";
    }
  });

  const contentType = computed(() => {
    switch (true) {
      case "siteId" in props.item && props.item.directoryId == 24:
        return "TIMETABLE";
      case "siteId" in props.item && props.item.directoryId == 26:
        return "TAXI";
      case "siteId" in props.item:
        return "SITE";
      case "businessId" in props.item:
        return "BUSINESS";
      case "postingId" in props.item:
        return "POSTING";
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
    alert(dialogTitle.value);
    alert(JSON.stringify(props.item));
    if (galleryUrl.value) {
      try {
        const [galleryResponse] = await Promise.all([axios.get<GalleryImage[]>(galleryUrl.value)]);
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
