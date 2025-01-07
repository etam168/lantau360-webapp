<template>
  <q-toolbar class="q-pr-md">
    <q-space />
    <app-button-rounded
      v-if="hasCheckIn"
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
  import { EntityURLKey } from "@/constants";

  // Stores
  import { useFavoriteStore } from "@/stores/favorite-store";
  import { useCheckInStore } from "@/stores/checkin-store";

  // Emit
  const emit = defineEmits(["check-in"]);

  // Props
  const { category, entityKey, hasCheckIn } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    hasCheckIn?: boolean;
  }>();

  const { handleOpenCheckInDialog } = useEntityDataHandlingService();

  // Composable function calls
  const favoriteStore = useFavoriteStore();
  const checkInStore = useCheckInStore();

  // Computed properties
  const isFavourite = computed(() => favoriteStore.isSiteFavorite(category as SiteView));
  const isCheckIn = computed(() => checkInStore.isCheckIn(category as SiteView));

  function onBtnCheckInClick() {
    const isDialogOpen = ref(false);
    const props = {
      entityKey: "CHECKIN",
      entityData: category
    };
    handleOpenCheckInDialog(props, isDialogOpen, "CHECKIN");
  }

  function onBtnFavClick() {
    switch (true) {
      case entityKey === "SITE":
        favoriteStore.toggleSiteFavorite(category as SiteView, isFavourite.value);
        break;
    }
  }
</script>
