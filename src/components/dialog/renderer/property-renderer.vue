<template>
  <gallery-component :item="item" />

  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section top>
        <q-item-label v-if="item.subtitle1" class="text-caption text-weight-light"
          >{{ translate(item.subtitle1, item.meta, "subtitle1") }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-if="translatedContent != null && translatedContent != ''">
      <app-text-editor v-model="translatedContent" />
    </q-item>
    <q-item>
      <q-item-section>
        <div class="q-gutter-md">
          <contact-content :item="item" />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { PostingView } from "@/interfaces/models/views/posting-view";

  //UI Components
  import GalleryComponent from "@/components/dialog/renderer/common/gallery-component.vue";
  import ContactContent from "@/components/dialog/renderer/common/contact-content.vue";

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
