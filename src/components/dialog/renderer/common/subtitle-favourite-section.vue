<template>
  <q-card-section horizontal class="justify-between">
    <q-card-section style="width: 100%" class="q-pb-none">
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
        <div class="text-h6 q-mb-none q-pb-none" v-else-if="item.customSubtitle2 || item.subtitle2">
          {{
            translate(
              item.customSubtitle2 ?? item.subtitle2,
              item.meta,
              item.customSubtitle2 ? "customSubtitle2" : "subtitle2"
            )
          }}
        </div>
      </div>

      <q-card-section>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="mdi-heart"
          @click="onBtnFavClick"
        />
      </q-card-section>
    </q-card-section>
  </q-card-section>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const { item } = defineProps<{
    item: CategoryTypes;
  }>();

  const { eventBus, isFavouriteItem, translate, toggleItemFavStatus } = useUtilities();
  const isFavourite = ref(isFavouriteItem(item));

  function onBtnFavClick() {
    toggleItemFavStatus(item, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", item);
  }
</script>
