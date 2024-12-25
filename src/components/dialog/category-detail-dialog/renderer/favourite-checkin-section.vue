<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-fab
      vertical-actions-align="right"
      color="primary"
      :icon="fasChevronUp"
      :active-icon="fasXmark"
      direction="up"
    >
      <q-fab-action
        v-if="
          ['expansion-description', 'timetable', 'expansion-location', 'favourite'].some(type =>
            renderItems.some(item => item.type === type)
          )
        "
        color="primary"
        :text-color="isFavourite ? 'red' : 'white'"
        external-label
        label-position="left"
        @click="onBtnFavClick"
        :icon="fasHeart"
        label="Favourite"
      />
      <q-fab-action
        v-if="
          ['expansion-description', 'expansion-location'].some(type =>
            renderItems.some(item => item.type === type)
          ) && hasCheckIn
        "
        color="primary"
        external-label
        label-position="left"
        @click="onBtnCheckInClick"
        :icon="fasMapLocationDot"
        label="Checkin"
      />
    </q-fab>
  </q-page-sticky>
</template>

<script setup lang="ts">
  import {
    fasChevronUp,
    fasHeart,
    fasMapLocationDot,
    fasXmark
  } from "@quasar/extras/fontawesome-v6";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { EntityURLKey } from "@/constants";

  const {
    category,
    entityKey,
    renderItems,
    hasCheckIn = false
  } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    renderItems: Array<{ name: string; type: string }>;
    hasCheckIn?: boolean;
  }>();

  // Composable function calls
  const { eventBus } = useUtilities();
  const { isFavouriteItem, toggleItemFavStatus } = useFavorite(entityKey);

  // Reactive variables
  const isFavourite = ref(isFavouriteItem(category));
  const emit = defineEmits(["check-in"]);

  function onBtnFavClick() {
    toggleItemFavStatus(category, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus("favoriteUpdated").emit(category);
  }
  function onBtnCheckInClick() {
    emit("check-in");
  }
</script>
