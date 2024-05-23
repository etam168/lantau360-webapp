<template>
  <gallery-component :item="item" />

  <q-list padding class="q-mx-sm q-pt-md">
    <q-item v-if="siteItem.subtitle1">
      <q-item-section avatar>
        <q-avatar
          v-if="$q.screen.gt.xs"
          dense
          rounded
          color="primary"
          icon="location_on"
          text-color="white"
          size="sm"
        />

        <q-avatar v-if="$q.screen.xs">
          <q-icon name="location_on" color="primary" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label v-if="siteItem.subtitle1" class="text-caption"
          >{{ translate(siteItem.subtitle1, siteItem.meta, "subtitle1") }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item>

    <q-item>
      <q-item-section>
        <div class="q-gutter-md">
          <contact-content :item="item" />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  //UI Components
  import GalleryComponent from "@/components/dialog/renderer/common/gallery-component.vue";
  import ContactContent from "@/components/dialog/renderer/common/contact-content.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });
  const { eventBus, isFavouriteItem, toggleItemFavStatus, translate } = useUtilities();

  const isFavourite = ref(isFavouriteItem(props.item));
  const siteItem = computed(() => props.item as SiteView);

  const translatedContent: any = ref(
    translate(siteItem.value.description, siteItem.value.meta, "description")
  );

  function onBtnFavClick() {
    toggleItemFavStatus(props.item, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", props.item);
  }
</script>
