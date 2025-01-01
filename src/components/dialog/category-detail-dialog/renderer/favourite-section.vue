<template>
  <q-toolbar class="q-pr-md">
    <q-space />
    <app-button-rounded
      v-if="hasCheckIn"
      color="primary"
      class="q-mr-sm"
      @click="onBtnCheckInClick"
      :icon="fasMapLocationDot"
    />

    <app-button-rounded
      :text-color="isFavourite ? 'red' : 'white'"
      :icon="fasHeart"
      @click="onBtnFavClick"
    />
  </q-toolbar>

  <!-- <q-card flat>
    <q-card-actions class="justify-end q-pt-md q-px-md q-pb-none">
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
    </q-card-actions>
  </q-card> -->
</template>

<script setup lang="ts">
  // Interface
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Constants
  import { fasHeart, fasMapLocationDot } from "@quasar/extras/fontawesome-v6";
  import { EntityURLKey } from "@/constants";

  // Stores
  import { useFavoriteStore } from "@/stores/favorite-store";
  import { useUserStore } from "@/stores/user";

  import { UserLogon } from "@/composable/use-member";

  // Emit
  const emit = defineEmits(["check-in"]);

  // Props
  const { category, entityKey, hasCheckIn } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    hasCheckIn?: boolean;
  }>();

  // Composable function calls
  const favoriteStore = useFavoriteStore();
  const userStore = useUserStore();
  const userLogon = UserLogon();

  // Computed properties
  const isFavourite = computed(() => favoriteStore.isSiteFavorite(category as SiteView));

  function onBtnCheckInClick() {
    emit("check-in");
  }

  function onBtnFavClick() {
    switch (true) {
      case !userStore.isUserLogon():
        userLogon.promptUserLogon();
        break;
      case entityKey === "SITE":
        favoriteStore.toggleSiteFavorite(category as SiteView, isFavourite.value);
        break;
    }
  }
</script>
