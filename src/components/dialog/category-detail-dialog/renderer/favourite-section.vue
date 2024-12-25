<template>
  <q-item>
    <q-item-section></q-item-section>
    <q-item-section top side>
      <div class="text-grey-8 q-gutter-xs">
        <app-button-rounded
          v-if="hasCheckIn"
          color="primary"
          @click="onBtnCheckInClick"
          :icon="fasMapLocationDot"
        />

        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          :icon="fasHeart"
          @click="onBtnFavClick"
        />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Third party imports
  import { fasHeart, fasMapLocationDot } from "@quasar/extras/fontawesome-v6";
  import { EntityURLKey } from "@/constants";

  // Emit
  const emit = defineEmits(["check-in"]);

  // Props
  const { category, entityKey, hasCheckIn } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    hasCheckIn?: boolean;
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

  function onBtnCheckInClick() {
    emit("check-in");
  }
</script>
