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

    <location-content
      :item="item"
      :default-tooltip="translate((props.item as SiteView).siteName, props.item.meta, 'siteName')"
      @open-map="openGoogleMaps"
    />
    <!-- Contact expansion -->
    <contact-section :item="item" v-if="item.contactPhone || item.contactWhatsApp" />
  </q-list>
</template>

<script setup lang="ts">
  //UI Component
  import GalleryComponent from "@/components/dialog/renderer/common/gallery-component.vue";
  import ContactSection from "@/components/dialog/renderer/common/contact-section.vue";
  import LocationContent from "@/components/dialog/renderer/common/location-content.vue";

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
  const { t } = useI18n({ useScope: "global" });
  const { eventBus, isFavouriteItem, toggleItemFavStatus, translate } = useUtilities();

  const isFavourite = ref(isFavouriteItem(props.item));
  const siteItem = computed(() => props?.item as SiteView);

  const onBtnFavClick = () => {
    toggleItemFavStatus(siteItem.value, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", props.item);
  };

  const openGoogleMaps = () => {
    if (props.item.meta?.["hasMap"]) {
      window.open(props.item.meta?.["mapLink"], "_blank");
    } else {
      $q.notify(t("errors.mapLinkNotAvailable"));
    }
  };
</script>
