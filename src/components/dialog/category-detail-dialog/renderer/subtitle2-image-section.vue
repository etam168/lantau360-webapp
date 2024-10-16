<template>
  <q-card-section class="text-h6 q-mb-none q-pb-none" v-if="item.customSubtitle2 || item.subtitle2">
    {{
      translate(
        item.customSubtitle2 ?? item.subtitle2,
        item.meta,
        item.customSubtitle2 ? "customSubtitle2" : "subtitle2"
      )
    }}
  </q-card-section>
  <q-img class="rounded-borders" :src="getImageURL(item.imagePath)" />
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const { item, itemCount = 1 } = defineProps<{
    item: CategoryTypes;
    itemCount?: number;
  }>();

  const { getImageURL, translate } = useUtilities();
</script>
