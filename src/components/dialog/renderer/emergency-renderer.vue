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

    <q-list
      class="rounded-borders q-mx-lg"
      v-if="siteItem.contactPhone || siteItem.contactWhatsApp"
    >
      <q-card>
        <q-card-section class="q-pa-sm">
          <q-expansion-item
            label="Info"
            group="siteGroup"
            dense
            dense-toggle
            default-opened
            header-class="text-h6"
          >
            <q-separator class="q-mt-sm" />
            <contact-content :item="item" />
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  //UI Component
  import ContactContent from "./common/contact-content.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { eventBus, isFavouriteItem, toggleItemFavStatus } = useUtilities();

  const isFavourite = ref(isFavouriteItem(props.item));
  const siteItem = computed(() => props.item as SiteView);

  function onBtnFavClick() {
    toggleItemFavStatus(props.item, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", props.item);
  }
</script>
