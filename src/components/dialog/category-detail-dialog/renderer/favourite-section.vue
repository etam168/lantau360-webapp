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
  import { fasHeart } from "@quasar/extras/fontawesome-v6";
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{
    category: CategoryTypes;
  }>();

  const { eventBus, isFavouriteItem, toggleItemFavStatus } = useUtilities();
  const isFavourite = ref(isFavouriteItem(category));

  function onBtnFavClick() {
    toggleItemFavStatus(category, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", category);
  }
</script>
