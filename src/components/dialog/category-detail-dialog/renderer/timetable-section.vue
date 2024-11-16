<template>
  <q-card flat square class="q-mt-xs">
    <q-card-section>
      <q-banner inline-actions>
        <q-toolbar-title>
          <div class="text-h6 q-mb-none q-pb-none">
            {{ formattedSubtitle1 }}
          </div>
        </q-toolbar-title>

        <template v-slot:action>
          <app-button-rounded
            :text-color="isFavourite ? 'red' : 'white'"
            :icon="fasHeart"
            @click="onBtnFavClick"
          />
        </template>
      </q-banner>
      <q-img class="rounded-borders" :src="getImageURL(category.bannerPath)" />
    </q-card-section>

    <!-- Display both bannerPath and imagePath if their conditions are met -->
    <q-card-section v-if="!isMaskValueOne">
      <q-banner inline-actions>
        <q-toolbar-title>
          <div class="text-h6 q-mb-none q-pb-none">
            {{ formattedSubtitle2 }}
          </div>
        </q-toolbar-title>
      </q-banner>

      <q-img class="rounded-borders" :src="getImageURL(category.imagePath)" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Third party imports
  import { fasHeart } from "@quasar/extras/fontawesome-v6";
  import { EntityURLKey } from "@/constants";

  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { eventBus, getImageURL, translate } = useUtilities();
  const { isFavouriteItem, toggleItemFavStatus } = useFavorite(entityKey);

  // Reactive variables
  const isFavourite = ref(isFavouriteItem(category));

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

  function onBtnFavClick() {
    toggleItemFavStatus(category, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus("favoriteUpdated").emit(category);
  }
</script>
