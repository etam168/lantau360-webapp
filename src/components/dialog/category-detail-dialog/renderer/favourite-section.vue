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
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types"

  // Third party imports
  import { fasHeart } from "@quasar/extras/fontawesome-v6";
  import { EntityURLKey } from "@/constants";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { eventBus } = useUtilities();
  const { isFavouriteItem, toggleItemFavStatus } = useFavorite(entityKey);

  // Reactive variables
  const isFavourite = ref(isFavouriteItem(category));

  function onBtnFavClick() {
    toggleItemFavStatus(category, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus("favoriteUpdated").emit(category);
  }
</script>
