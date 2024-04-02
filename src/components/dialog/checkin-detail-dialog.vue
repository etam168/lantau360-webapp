<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ $t("more.checkInInfoDetail") }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <gallery-image-list :image-list="galleryItems" />
          <q-list class="q-gutter-md">
            <q-item v-for="(checkInfo, index) in data.checkInfo" :key="index">
              <q-item-section>
                <q-item-label caption>{{
                  new Date(checkInfo.checkInAt).toLocaleString()
                }}</q-item-label>
                <q-item-label lines="2">{{ checkInfo.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { URL } from "@/constants";
  // // Quasar Import
  // import { throttle } from "quasar";
  // import { BLOB_URL } from "@/constants";

  // Interface files
  import { CheckIn } from "@/interfaces/models/entities/CheckIn";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  const props = defineProps({
    data: {
      type: Object as PropType<CheckIn>,
      required: true
    }
  });
  // Interface files

  // Custom Components

  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const { t } = useI18n({ useScope: "global" });
  const error = ref<string | null>(null);

  const galleryItems = ref<GalleryImageType[]>([]);
  const galleryImagesCompleteList = ref<GalleryImageType[]>([]);

  const galleryUrl = computed(() => {
    return `${URL.SITE_GALLERY}/${props.data.siteId}`;
  });

  const loadData = async () => {
    if (galleryUrl.value) {
      try {
        const [galleryResponse] = await Promise.all([
          axios.get<GalleryImageType[]>(galleryUrl.value)
        ]);
        galleryImagesCompleteList.value = galleryResponse.data;
        galleryImagesCompleteList.value.sort((a, b) => a.ranking - b.ranking);

        galleryItems.value = galleryResponse.data
          .filter(element => !((1 >> (element.ranking - 1)) & 1))
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

  onMounted(() => {
    loadData();
  });
</script>
