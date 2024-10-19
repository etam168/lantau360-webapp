<template>
  <template v-if="isMaskValueOne || formattedSubtitle1">
    <q-banner inline-actions>
      <q-toolbar-title>
        <!-- For maskValue === 1 -->
        <div class="text-h6 q-mb-none q-pb-none" v-if="isMaskValueOne">
          {{ getSubtitlesForMaskOne() }}
        </div>
        <!-- For other cases -->
        <div v-else>
          <div class="text-h6 q-mb-none q-pb-none" v-if="formattedSubtitle1">
            {{ formattedSubtitle1 }}
          </div>
        </div>
      </q-toolbar-title>

      <template v-slot:action>
        <!-- Center the chips -->
        <q-toolbar v-bind="$attrs" class="q-gutter-x-sm">
          <app-button-rounded
            :text-color="isFavourite ? 'red' : 'white'"
            :icon="fasHeart"
            @click="onBtnFavClick"
          />
        </q-toolbar>
      </template>
    </q-banner>

    <q-card-section class="q-pa-none">
      <q-img class="rounded-borders" :src="getImageURL(category.bannerPath)" />
    </q-card-section>
  </template>

  <template v-if="formattedSubtitle2">
    <q-banner inline-actions>
      <q-toolbar-title>
        <div class="text-h6 q-mb-none q-pb-none">
          {{ formattedSubtitle2 }}
        </div>
      </q-toolbar-title>
    </q-banner>

    <!-- Display both bannerPath and imagePath if their conditions are met -->

    <q-card-section class="q-pa-none">
      <q-img class="rounded-borders" :src="getImageURL(category.imagePath)" />
    </q-card-section>
  </template>
</template>

<script setup lang="ts">
  import { fasHeart } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const { category, itemCount = 1 } = defineProps<{
    category: CategoryTypes;
    itemCount?: number;
  }>();

  const { eventBus, getImageURL, isFavouriteItem, translate, toggleItemFavStatus } = useUtilities();
  const isFavourite = ref(isFavouriteItem(category));

  const isMaskValueOne = computed(() => {
    return Number(category.meta.maskValue) === 1;
  });

  function getSubtitlesForMaskOne() {
    const subtitle1 = translate(category.subtitle1, category.meta, "subtitle1");
    const subtitle2 = translate(category.subtitle2, category.meta, "subtitle2");
    return `${subtitle1} | ${subtitle2}`;
  }

  // Computed properties for handling other subtitle conditions
  const formattedSubtitle1 = computed(() => {
    if (category.customSubtitle1 || category.subtitle1) {
      return translate(
        category.customSubtitle1 ?? category.subtitle1,
        category.meta,
        category.customSubtitle1 ? "customSubtitle1" : "subtitle1"
      );
    }
    return null;
  });

  const formattedSubtitle2 = computed(() => {
    if (category.customSubtitle2 || category.subtitle2) {
      return translate(
        category.customSubtitle2 ?? category.subtitle2,
        category.meta,
        category.customSubtitle2 ? "customSubtitle2" : "subtitle2"
      );
    }
    return null;
  });

  function onBtnFavClick() {
    toggleItemFavStatus(category, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", category);
  }
</script>
