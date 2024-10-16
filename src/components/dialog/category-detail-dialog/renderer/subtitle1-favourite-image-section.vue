<template>
  <q-banner inline-actions>
    <q-toolbar-title>
      <div class="text-h6 q-mb-none q-pb-none" v-if="Number(item.meta.maskValue) === 1">
        {{ translate(item.subtitle1, item.meta, "subtitle1") }} |
        {{ translate(item.subtitle2, item.meta, "subtitle2") }}
      </div>
      <div v-else>
        <div class="text-h6 q-mb-none q-pb-none" v-if="item.customSubtitle1 || item.subtitle1">
          {{
            translate(
              item.customSubtitle1 ?? item.subtitle1,
              item.meta,
              item.customSubtitle1 ? "customSubtitle1" : "subtitle1"
            )
          }}
        </div>
      </div>
    </q-toolbar-title>

    <template v-slot:action>
      <!-- Center the chips -->
      <q-toolbar v-bind="$attrs" class="q-gutter-x-sm">
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="mdi-heart"
          @click="onBtnFavClick"
        />
      </q-toolbar>
    </template>
  </q-banner>

  <q-card-section class="q-pa-none">
    <q-img class="rounded-borders" :src="getImageURL(item.bannerPath)" />
  </q-card-section>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const { item, itemCount = 1 } = defineProps<{
    item: CategoryTypes;
    itemCount?: number;
  }>();

  const { eventBus, getImageURL, isFavouriteItem, translate, toggleItemFavStatus } = useUtilities();
  const isFavourite = ref(isFavouriteItem(item));

  function onBtnFavClick() {
    toggleItemFavStatus(item, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", item);
  }
</script>
