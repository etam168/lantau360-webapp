<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section top>
        <q-item-label v-if="item.subtitle1" class="text-caption text-weight-light"
          >{{ translate(item.subtitle1, item.meta, "subtitle1") }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="q-gutter-md">
          <app-button-rounded v-if="item.contactPhone" icon="phone" @click="navigateToPhone" />

          <app-button-rounded
            v-if="item.contactWhatsApp"
            icon="fab fa-whatsapp"
            @click="navigateToWhatsApp(item.contactWhatsApp)"
          />
          <app-button-rounded
            :text-color="isFavourite ? 'red' : 'white'"
            icon="favorite"
            @click="onBtnFavClick"
          />
        </div>
      </q-item-section>
    </q-item>

    <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { Site } from "@/interfaces/models/entities/site";

  // .ts files
  import { STORAGE_KEYS } from "@/constants";

  const { eventBus, navigateToWhatsApp, translate } = useUtilities();
  const directoryItem = ref<Site>({} as Site);

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const siteItem = computed(() => props?.item as Site);

  const translatedContent: any = computed(() => {
    return translate(siteItem.value.description, siteItem.value.meta, "description");
  });

  const favoriteItems = ref((LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as Site[]);

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
    eventBus.emit("favoriteUpdated", {
      siteId: directoryItem.value.siteId || null
    });
  };
</script>
