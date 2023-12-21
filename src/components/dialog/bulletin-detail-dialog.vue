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

          <event-content v-if="renderer === RENDERER.EVENT" :item="item" />
          <news-content v-else-if="renderer === RENDERER.NEWS" :item="item" />
          <notice-content v-else-if="renderer === RENDERER.NOTICE" :item="item" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import axios, { AxiosError } from "axios";
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";

  // .ts files
  import { URL, RENDERER } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  // Custom Components
  import EventContent from "@/components/dialog/renderer/event-content.vue";
  import NewsContent from "@/components/dialog/renderer/news-content.vue";
  import NoticeContent from "@/components/dialog/renderer/notice-content.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const { translate } = useUtilities();
  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImage[]>([]);

  const dialogTitle = computed(() => {
    switch (true) {
      case "communityEventId" in props.item:
        return translate(props.item.communityEventName, props.item.meta, "communityEventName");
      case "communityNewsId" in props.item:
        return translate(props.item.communityNewsName, props.item.meta, "communityNewsName");
      case "communityNoticeId" in props.item:
        return translate(props.item.communityNoticeName, props.item.meta, "communityNoticeName");
      default:
        return "";
    }
  });

  const galleryUrl = computed(() => {
    switch (true) {
      case "communityEventId" in props.item:
        return `${URL.COMMUNITY_EVENT_GALLERY}/${props.item.communityEventId}`;
      case "communityNewsId" in props.item:
        return `${URL.COMMUNITY_NEWS_GALLERY}/${props.item.communityNewsId}`;
      case "communityNoticeId" in props.item:
        return `${URL.COMMUNITY_NOTICE_GALLERY}/${props.item.communityNoticeId}`;

      default:
        return "";
    }
  });

  const renderer = computed(() => {
    switch (true) {
      case "communityEventId" in props.item:
        return RENDERER.EVENT;
      case "communityNewsId" in props.item:
        return RENDERER.NEWS;
      case "communityNoticeId" in props.item:
        return RENDERER.NOTICE;
      default:
        return "";
    }
  });

  onMounted(() => {
    loadData();
    eventBus.on("BulletinDetailDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "BulletinDetailDialog");
  }

  const loadData = async () => {
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
