<template>
  <q-card bordered flat square class="q-mt-xs q-ma-md">
    <q-card-actions class="justify-between q-px-md">
      <div class="text-h6 q-mb-none q-pb-none">{{ formattedSubtitle1 }}</div>
      <app-button-rounded
        :text-color="isFavourite ? 'red' : 'white'"
        :icon="fasHeart"
        @click="onBtnFavClick"
      />
    </q-card-actions>

    <q-separator />

    <q-card-section class="q-pa-sm">
      <q-img class="rounded-borders" :src="getImageURL(category.bannerPath)" />
    </q-card-section>
  </q-card>

  <q-card bordered flat square class="q-mt-xs q-ma-md" v-if="!isMaskValueOne">
    <!-- Display both bannerPath and imagePath if their conditions are met -->
    <div class="text-h6 q-mb-none q-px-md q-py-sm">{{ formattedSubtitle2 }}</div>
    <q-separator />
    <q-card-section class="q-pa-sm">
      <q-img class="rounded-borders" :src="getImageURL(category.imagePath)" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasHeart } from "@quasar/extras/fontawesome-v6";
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

  const { eventBus, getImageURL, translate } = useUtilities(locale.value);
  const { isFavouriteItem, toggleItemFavStatus } = useFavorite(entityKey);

  // Reactive variables
  const isFavourite = ref(isFavouriteItem(category));

  const isMaskValueOne = computed(() => {
    return Number((category as SiteView).displayMask) === 1;
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

  function onBtnFavClick() {
    toggleItemFavStatus(category, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus("favoriteUpdated").emit(category);
  }
</script>
