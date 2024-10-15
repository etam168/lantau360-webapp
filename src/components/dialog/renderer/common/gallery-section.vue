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
    },
    galleryItems: {
      type: Array as PropType<GalleryImageType[]>,
      required: true
    }
  });

  const { t } = useI18n({ useScope: "global" });
  const { isSiteView, isBusinessView, isPostingView } = useUtilities();

  const error = ref<string | null>(null);
</script>
