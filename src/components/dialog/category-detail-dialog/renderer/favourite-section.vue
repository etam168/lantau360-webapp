<template>
  <q-item>
    <q-item-section></q-item-section>
    <q-item-section side>
      <app-button-rounded
        :text-color="isFavourite ? 'red' : 'white'"
        icon="mdi-heart"
        @click="onBtnFavClick"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
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
