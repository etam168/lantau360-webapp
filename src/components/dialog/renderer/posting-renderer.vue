<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section top>
        <q-item-label v-if="item.subtitle1" class="text-caption text-weight-light"
          >{{ translate(item.subtitle1, item.meta, "subtitle1") }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { PostingView } from "@/interfaces/models/views/posting-view";

  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const postingItem = computed(() => props?.item as PostingView);

  const translatedContent: any = ref(
    translate(postingItem.value.description, postingItem.value.meta, "description")
  );
</script>
