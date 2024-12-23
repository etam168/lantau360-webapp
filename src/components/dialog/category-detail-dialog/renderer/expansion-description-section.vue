<template>
  <q-card class="q-ma-md">
    <q-expansion-item
      group="itemGroup"
      class="detail-page-expansion"
      dense-toggle
      expand-icon-toggle
      :expand-icon="fasAngleDown"
    >
      <template v-slot:header>
        <q-item-section class="text-h6">
          <!-- Conditional rendering for Washroom -->
          <template v-if="isWashroom">
            {{ $t(`${i18nKey}.info`) }}
          </template>
          <template v-else>
            {{ $t(`${i18nKey}.description`) }}
          </template>
        </q-item-section>

        <q-item-section side>
          <app-button-rounded
            :text-color="isFavourite ? 'red' : 'white'"
            :icon="fasHeart"
            @click="onBtnFavClick"
          />
        </q-item-section>
      </template>
      <q-separator />

      <q-card>
        <q-card-section class="q-pa-sm">
          <div v-html="translatedContent"></div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasAngleDown, fasHeart } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import { EntityURLKey } from "@/constants";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });

  const { eventBus, translate } = useUtilities(locale.value);
  const { isFavouriteItem, toggleItemFavStatus } = useFavorite(entityKey);

  // Reactive variables
  const i18nKey = "home.dialog";
  const translatedContent = ref(translate(category.description, category.meta, "description"));
  const isFavourite = ref(isFavouriteItem(category));

  // Check if directoryName is Washroom (case-insensitive)
  const isWashroom = computed(() => ["Washroom", "washroom"].includes(category.directoryName));

  function onBtnFavClick() {
    toggleItemFavStatus(category, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus("favoriteUpdated").emit(category);
  }
</script>

<style>
  .q-expansion-item.detail-page-expansion .q-item {
    padding: 8px !important;
  }
</style>
