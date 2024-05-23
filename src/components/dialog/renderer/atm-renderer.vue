<template>
  <gallery-component :item="item" />
  <q-list padding class="q-pa-none q-pb-md" style="background-color: #f6f6f6">
    <q-item>
      <q-item-section></q-item-section>
      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
      /></q-item-section>
    </q-item>

    <q-list class="rounded-borders q-mx-lg">
      <q-card>
        <q-card-section class="q-pa-sm">
          <q-expansion-item
            :label="$t('home.location')"
            group="siteGroup"
            dense
            dense-toggle
            default-opened
            header-class="text-h6"
          >
            <q-separator />

            <q-card
              flat
              class="q-ma-md"
              :style="{
                height: $q.screen.gt.xs ? '370px' : 'auto'
              }"
            >
              <q-card-section
                class="justify-between q-pa-none"
                :class="{ 'row no-wrap': $q.screen.gt.xs, column: !$q.screen.gt.xs }"
                style="width: 100%"
              >
                <map-component :item="item" />
                <contact-content :item="item" class="q-mr-xl" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  //UI Component
  import GalleryComponent from "@/components/dialog/renderer/common/gallery-component.vue";
  import ContactContent from "@/components/dialog/renderer/common/contact-content.vue";
  import MapComponent from "@/components/dialog/renderer/common/map-component.vue";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const $q = useQuasar();
  const { eventBus, isFavouriteItem, toggleItemFavStatus } = useUtilities();

  const isFavourite = ref(isFavouriteItem(props.item));
  const siteItem = computed(() => props?.item as SiteView);

  const onBtnFavClick = () => {
    toggleItemFavStatus(siteItem.value, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", props.item);
  };
</script>
