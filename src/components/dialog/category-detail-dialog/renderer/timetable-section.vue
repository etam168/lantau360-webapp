<template>
  <q-card flat square class="q-mt-xs">
    <q-card-section class="text-h6 q-mb-none q-pb-md">
      {{ formattedSubtitle1 }}

      <q-img class="rounded-borders" :src="getImageURL(category.bannerPath)" />
    </q-card-section>

    <!-- Display both bannerPath and imagePath if their conditions are met -->
    <q-card-section v-if="!isMaskValueOne" class="text-h6 q-mb-none q-pb-none">
      {{ formattedSubtitle2 }}

      <q-img class="rounded-borders" :src="getImageURL(category.imagePath)" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Third party imports
  import { EntityURLKey } from "@/constants";

  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });

  const { getImageURL, translate } = useUtilities(locale.value);

  const isMaskValueOne = computed(() => {
    return Number((category as SiteView).meta.maskValue) === 1;
  });

  // Computed properties for handling other subtitle conditions
  const formattedSubtitle1 = computed(() => {
    if (isMaskValueOne.value) {
      return translate(category.title, category.meta, "title");
    } else {
      return translate(category.subtitle1, category.meta, "subtitle1");
    }
  });

  const formattedSubtitle2 = computed(() => {
    return translate(category.subtitle2, category.meta, "subtitle2");
  });
</script>
