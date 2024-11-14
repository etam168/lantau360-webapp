<template>
  <q-item>
    <q-item-section></q-item-section>
    <q-item-section side>
      <app-button-rounded
        :text-color="isFavourite ? 'red' : 'white'"
        :icon="fasHeart"
        @click="onBtnFavClick"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasHeart } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{
    category: CategoryTypes;
  }>();

  // Composable function calls
  const { eventBus, isFavouriteItem, toggleItemFavStatus } = useUtilities();

  // Reactive variables
  const isFavourite = ref(isFavouriteItem(category));

  function onBtnFavClick() {
    toggleItemFavStatus(category, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus("favoriteUpdated").emit(category);
  }
</script>
