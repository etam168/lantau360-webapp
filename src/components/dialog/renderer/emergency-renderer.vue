<template>
  <q-list padding class="q-pa-none q-pb-md">
    <q-item>
      <q-item-section></q-item-section>
      <q-item-section class="q-mt-md" side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
        />
      </q-item-section>
    </q-item>

    <!-- Contact expansion -->
    <contact-section
      class="q-mx-sm"
      :item="item"
      v-if="item.contactPhone || item.contactWhatsApp"
    />
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  //UI Component
  import ContactSection from "@/components/dialog/renderer/common/contact-section.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { eventBus, isFavouriteItem, toggleItemFavStatus } = useUtilities();

  const isFavourite = ref(isFavouriteItem(props.item));

  function onBtnFavClick() {
    toggleItemFavStatus(props.item, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", props.item);
  }
</script>
