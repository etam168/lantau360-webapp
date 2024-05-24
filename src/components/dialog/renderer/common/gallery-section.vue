<template>
  <div class="q-items-center q-pa-none">
    <gallery-image-list :image-list="galleryItems" />
  </div>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // .ts files
  import { TEMPLATE, URL } from "@/constants";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { t } = useI18n({ useScope: "global" });
  const { isSiteView, isBusinessView, isPostingView } = useUtilities();

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImageType[]>([]);

  function getMaskValue(templateValue: number, meta?: any) {
    for (const make in TEMPLATE) {
      if (TEMPLATE[make as keyof typeof TEMPLATE].value === templateValue) {
        const modifier = meta?.["hasMap"] === true ? 2 : 0;
        return TEMPLATE[make as keyof typeof TEMPLATE].mask + modifier;
      }
    }
    return 0;
  }

  async function loadData() {
    const galleryUrl = getGalleryImageUrl();
    if (galleryUrl) {
      try {
        const [galleryResponse] = await Promise.all([axios.get<GalleryImageType[]>(galleryUrl)]);

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
  }

  function getGalleryImageUrl() {
    const { item } = props;
    if (isSiteView(item)) {
      return `${URL.SITE_GALLERY}/${item.siteId}`;
    } else if (isBusinessView(item)) {
      return `${URL.BUSINESS_GALLERY}/${item.businessId}`;
    } else if (isPostingView(item)) {
      return `${URL.POSTING_GALLERY}/${item.postingId}`;
    }
    return null;
  }

  onMounted(() => {
    loadData();
  });
</script>
