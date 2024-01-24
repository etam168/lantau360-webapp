<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section top>
        <q-item-label v-if="siteItem.subtitle1" class="text-caption text-weight-light"
          >{{ translate(siteItem.subtitle1, siteItem.meta, "subtitle1") }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          :class="{ 'margin-top-right': imageCount > 1, 'margin-top': imageCount <= 1 }"
          @click="onBtnFavClick"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <app-text-editor style="width: 100%" v-model="translatedContent" />
    </q-item>

    <q-item>
      <q-item-section>
        <div class="q-gutter-md">
          <app-button-rounded v-if="siteItem.contactPhone" icon="phone" @click="navigateToPhone" />

          <app-button-rounded
            v-if="siteItem.contactWhatsApp"
            icon="fab fa-whatsapp"
            @click="navigateToWhatsApp(siteItem.contactWhatsApp)"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts files
  import { STORAGE_KEYS } from "@/constants";

  const { eventBus, navigateToWhatsApp, translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    },
    imageCount: {
      type: Number,
      required: true
    }
  });

  const siteItem = computed(() => props.item as SiteView);

  const translatedContent: any = ref(
    translate(siteItem.value.description, siteItem.value.meta, "description")
  );

  const favoriteItems = ref((LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[]);

  const isFavourite = computed(() => {
    const favItem = favoriteItems.value;
    return useArraySome(favItem, fav => fav.siteId == siteItem.value.siteId).value;
  });

  const navigateToPhone = () => {
    if (siteItem.value.contactPhone) {
      const phoneURL = `tel:${siteItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  const onBtnFavClick = () => {
    const localFavItem = favoriteItems.value;
    if (isFavourite.value) {
      const itemIndex = localFavItem.findIndex(
        (item: any) => item.siteId === siteItem.value.siteId
      );

      if (itemIndex !== -1) {
        localFavItem.splice(itemIndex, 1);
        favoriteItems.value = localFavItem;
      }
    } else {
      localFavItem.push(siteItem.value);
      favoriteItems.value = localFavItem;
    }
    LocalStorage.set(STORAGE_KEYS.SAVED.SITE, favoriteItems.value);

    eventBus.emit("favoriteUpdated", props.item);
  };
</script>
<style scoped>
  .margin-top {
    margin-top: -50px;
  }

  .margin-top-right {
    margin-top: -50px;
    margin-right: -15px;
  }
</style>
