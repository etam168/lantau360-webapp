<template>
  <q-card class="q-mb-md" v-if="translatedContent != null">
    <q-card-section class="q-pa-sm">
      <q-expansion-item group="itemGroup" dense dense-toggle>
        <template v-slot:header>
          <q-item-section class="text-h6">
            {{ $t(`${i18nKey}.description`) }}
          </q-item-section>

          <q-item-section side>
            <app-button-rounded
              :text-color="isFavourite ? 'red' : 'white'"
              icon="mdi-heart"
              @click="onBtnFavClick"
            />
          </q-item-section>
        </template>
        <q-separator />

        <q-card>
          <q-card-section class="q-pa-md">
            <app-text-editor v-model="translatedContent" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { eventBus, isFavouriteItem, toggleItemFavStatus, translate } = useUtilities();

  const i18nKey = "home";
  const translatedContent = ref(translate(props.item.description, props.item.meta, "description"));
  const isFavourite = ref(isFavouriteItem(props.item));

  function onBtnFavClick() {
    toggleItemFavStatus(props.item, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", props.item);
  }
</script>
