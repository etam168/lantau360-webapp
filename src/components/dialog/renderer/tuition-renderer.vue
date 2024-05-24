<template>
  <gallery-section :item="item" />

  <q-list padding class="q-mx-sm q-pa-none">
    <q-item v-if="item.subtitle1">
      <q-item-section top>
        <q-item-label v-if="item.subtitle1" class="text-caption text-weight-light"
          >{{ translate(item.subtitle1, item.meta, "subtitle1") }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-if="translatedContent != null && translatedContent != ''">
      <app-text-editor v-model="translatedContent" />
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { PostingView } from "@/interfaces/models/views/posting-view";

  //UI Components
  import GallerySection from "@/components/dialog/renderer/common/gallery-section.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { translate } = useUtilities();

  const postingItem = computed(() => props?.item as PostingView);

  const translatedContent: any = ref(
    translate(postingItem.value.description, postingItem.value.meta, "description")
  );
</script>
