<template>
  <q-card-section class="q-pa-none">
    <q-item class="q-py-none">
      <q-item-section>
        <app-tab-select
          :tab-items="tabItems"
          :current-tab="tab"
          @update:currentTab="setTab"
          class="q-px-none"
        />
      </q-item-section>

      <q-item-section side>
        <q-item-label>
          <q-btn
            v-if="siteItem.contactPhone"
            color="primary"
            text-color="white"
            icon="phone"
            size="sm"
            round
            class="q-mr-sm"
            @click="navigateToPhone"
          />

          <q-btn
            v-if="siteItem.contactWhatsApp"
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
            text-color="white"
            icon="favorite"
            size="sm"
            round
            @click="onBtnFavClick"
          />
        </q-item-label>
      </q-item-section>
    </q-item>

    <app-tab-panels v-model="tab">
      <q-tab-panel :name="siteItem.subtitle1" class="q-pa-none">
        <q-scroll-area style="height: calc(100vh - 110px)">
          <q-img :src="computePath(siteItem.imagePath)" />
        </q-scroll-area>
      </q-tab-panel>

      <q-tab-panel :name="siteItem.subtitle2" class="q-pa-none"
        ><q-img :src="computePath(siteItem.bannerPath)" />
      </q-tab-panel>
    </app-tab-panels>
  </q-card-section>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";
  import { Site } from "@/interfaces/models/entities/site";
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";
  import { TabItem } from "@/interfaces/tab-item";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const siteItem = computed(() => props.item as Site);
  const directoryItem = ref<Site>({} as Site);

  const { eventBus, navigateToWhatsApp, translate } = useUtilities();

  const setTab = (val: string) => (tab.value = val);
  const tab = ref(siteItem.value.subtitle1);

  const tabItems = ref<TabItem[]>([
    {
      name: siteItem.value.subtitle1,
      label: translate(siteItem.value.subtitle1, siteItem.value.meta, "subtitle1")
    },
    {
      name: siteItem.value.subtitle2,
      label: translate(siteItem.value.subtitle2, siteItem.value.meta, "subtitle2")
    }
  ]);

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };
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
