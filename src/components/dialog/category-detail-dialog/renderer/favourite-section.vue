<template>
  <q-toolbar class="q-pr-md">
    <q-space />
    <app-button-rounded
      v-if="entityKey.includes('SITE') && category.directoryTemplate !== TEMPLATE.TAXI.value"
      :text-color="isCheckIn ? 'amber' : 'white'"
      class="q-mr-sm"
      @click="onBtnCheckInClick"
      :icon="fasLocationDot"
    />

    <app-button-rounded
      :text-color="isFavourite ? 'red' : 'white'"
      :icon="fasHeart"
      @click="onBtnFavClick"
    />
  </q-toolbar>
</template>

<script setup lang="ts">
  // Interface
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Constants
  import { fasHeart, fasLocationDot } from "@quasar/extras/fontawesome-v6";
  import { EntityURLKey, TEMPLATE } from "@/constants";

  // Stores
  import { useFavoriteStore } from "@/stores/favorite-store";
  import { useCheckInStore } from "@/stores/checkin-store";

  // Emit
  const emit = defineEmits(["check-in"]);

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  const { requestCheckIn } = useCheckInDataService();

  // Composable function calls
  const favoriteStore = useFavoriteStore();
  const checkInStore = useCheckInStore();

  // Computed properties
  const isFavourite = computed(() => favoriteStore.isSiteFavorite(category as SiteView));
  const isCheckIn = computed(() => checkInStore.isCheckIn(category as SiteView));

  function onBtnCheckInClick() {
    requestCheckIn(category);
  }

  function onBtnFavClick() {
    switch (true) {
      case entityKey === "SITE":
        favoriteStore.toggleSiteFavorite(category as SiteView, isFavourite.value);
        break;
    }
  }
</script>
