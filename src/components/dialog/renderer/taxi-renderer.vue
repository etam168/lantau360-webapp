<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <template
        v-if="
          siteItem.subtitle1 !== null &&
          siteItem.subtitle1 !== undefined &&
          siteItem.subtitle1 !== ''
        "
      >
        <q-item-section top>
          <q-item-label class="text-caption text-weight-light"
            >{{ translate(siteItem.subtitle1, siteItem.meta, "subtitle1") }}
          </q-item-label>
        </q-item-section>
      </template>

      <q-item-section v-else></q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            v-if="
              siteItem.contactPhone !== null &&
              siteItem.contactPhone !== undefined &&
              siteItem.contactPhone !== ''
            "
            color="primary"
            text-color="white"
            icon="phone"
            size="sm"
            round
            class="q-mr-sm"
            @click="navigateToPhone"
          />

          <q-btn
            v-if="
              siteItem.contactWhatsApp !== null &&
              siteItem.contactWhatsApp !== undefined &&
              siteItem.contactWhatsApp !== ''
            "
            color="primary"
            text-color="white"
            icon="fab fa-whatsapp"
            size="sm"
            round
            class="q-mr-sm"
            @click="navigateToWhatsApp(siteItem.contactWhatsApp)"
          />
          <q-btn
            color="primary"
            :text-color="isFavourite ? 'red' : 'white'"
            icon="favorite"
            size="sm"
            round
            @click="onBtnFavClick"
          />
          {{ isFavourite }}
          {{ favoriteItems.length }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";
  import { STORAGE_KEYS } from "@/constants";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { Site } from "@/interfaces/models/entities/site";

  const directoryItem = ref<Site>({} as Site);
  const { eventBus, navigateToWhatsApp, translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const siteItem = computed(() => props.item as Site);

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
    eventBus.emit("favoriteUpdated", {
      siteId: directoryItem.value.siteId || null
    });
  };
</script>
