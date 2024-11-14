<template>
  <q-card class="q-ma-md">
    <q-card-section class="q-pa-sm">
      <q-expansion-item group="itemGroup" dense dense-toggle :expand-icon="fasChevronDown">
        <template v-slot:header>
          <q-item-section class="text-h6">
            {{ $t(`${i18nKey}.description`) }}
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
          <q-card-section class="q-pa-md">
            <div v-html="translatedContent"></div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { fasChevronDown, fasHeart } from "@quasar/extras/fontawesome-v6";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{
    category: CategoryTypes;
  }>();

  const { eventBus, isFavouriteItem, toggleItemFavStatus, translate } = useUtilities();

  const i18nKey = "home";
  const translatedContent = ref(translate(category.description, category.meta, "description"));
  const isFavourite = ref(isFavouriteItem(category));

  function onBtnFavClick() {
    toggleItemFavStatus(category, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus("favoriteUpdated").emit(category);
  }
</script>
