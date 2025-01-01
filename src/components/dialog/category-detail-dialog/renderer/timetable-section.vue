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
  // Interface files
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Constants
  import { EntityURLKey } from "@/constants";
  import { fasHeart } from "@quasar/extras/fontawesome-v6";

  // Stores
  import { useFavoriteStore } from "@/stores/favorite-store";
  import { useUserStore } from "@/stores/user";
  import { UserLogon } from "@/composable/use-member";

  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });
  const { getImageURL, translate } = useUtilities(locale.value);

  const favoriteStore = useFavoriteStore();
  const userStore = useUserStore();
  const userLogon = UserLogon();

  // Computed properties
  const isFavourite = computed(() => favoriteStore.isSiteFavorite(category as SiteView));

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
    switch (true) {
      case !userStore.isUserLogon():
        userLogon.promptUserLogon();
        break;
      case entityKey === "BUSINESS":
        favoriteStore.toggleBusinessFavorite(category as BusinessView, isFavourite.value);
        break;
      case entityKey === "SITE":
        favoriteStore.toggleSiteFavorite(category as SiteView, isFavourite.value);
        break;
    }
  }
</script>
