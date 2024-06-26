<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ bulletinData.dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <div v-if="galleryItems && galleryItems?.length > 0">
            <gallery-image-list :image-list="galleryItems" />
          </div>
          <div v-else>
            <q-responsive :ratio="16 / 9">
              <q-img :src="IMAGES.NO_IMAGE_AVAILABLE_PLACEHOLDER" />
            </q-responsive>
          </div>

          <event-renderer v-if="bulletinData.renderer === RENDERER.EVENT" :item="item" />
          <news-renderer v-else-if="bulletinData.renderer === RENDERER.NEWS" :item="item" />
          <notice-renderer v-else-if="bulletinData.renderer === RENDERER.NOTICE" :item="item" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // .ts files
  import { URL, RENDERER, IMAGES } from "@/constants";

  // Custom Components
  import EventRenderer from "@/components/dialog/renderer/event-renderer.vue";
  import NewsRenderer from "@/components/dialog/renderer/news-renderer.vue";
  import NoticeRenderer from "@/components/dialog/renderer/notice-renderer.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const { translate, eventBus, isCommunityEvent, isCommunityNews, isCommunityNotice } =
    useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const { t } = useI18n({ useScope: "global" });
  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImageType[]>([]);

  function getBulletinData() {
    let url = "";
    let renderer = "";
    let dialogTitle = "";

    if (isCommunityEvent(props.item)) {
      url = `${URL.COMMUNITY_EVENT_GALLERY}/${props.item.communityEventId}`;
      renderer = RENDERER.EVENT;
      dialogTitle = translate(props.item.communityEventName, props.item.meta, "communityEventName");
    } else if (isCommunityNews(props.item)) {
      url = `${URL.COMMUNITY_NEWS_GALLERY}/${props.item.communityNewsId}`;
      renderer = RENDERER.NEWS;
      dialogTitle = translate(props.item.communityNewsName, props.item.meta, "communityNewsName");
    } else if (isCommunityNotice(props.item)) {
      url = `${URL.COMMUNITY_NOTICE_GALLERY}/${props.item.communityNoticeId}`;
      renderer = RENDERER.NOTICE;
      dialogTitle = translate(
        props.item.communityNoticeName,
        props.item.meta,
        "communityNoticeName"
      );
    }

    return { url, renderer, dialogTitle };
  }

  const bulletinData = computed(() => getBulletinData());

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
    const galleryUrl = bulletinData.value.url;
    if (galleryUrl) {
      try {
        const [galleryResponse] = await Promise.all([axios.get(galleryUrl)]);
        galleryItems.value = galleryResponse.data;
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
</script>
