<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section top>
        <app-tab-select
          :tab-items="tabItems"
          :current-tab="tab"
          @update:currentTab="setTab"
          class="q-px-none"
        />
      </q-item-section>

      <q-item-section side>
        <app-button-rounded
          icon="favorite"
          :text-color="isFavourite ? 'red' : 'white'"
          @click="onBtnFavClick"
        />
      </q-item-section>
    </q-item>

    <q-tab-panels v-model="tab">
      <q-tab-panel :name="siteItem.subtitle1" class="q-pa-none">
        <q-scroll-area style="height: calc(100vh - 110px)">
          <q-img :src="computeImagePath" />
        </q-scroll-area>
      </q-tab-panel>

      <q-tab-panel :name="siteItem.subtitle2" class="q-pa-none"
        ><q-img :src="computeBannerPath" />
      </q-tab-panel>
    </q-tab-panels>
  </q-list>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { TabItem } from "@/interfaces/tab-item";

  // .ts files
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const siteItem = computed(() => props.item as SiteView);

  const { eventBus, translate } = useUtilities();

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

  const computeImagePath = computed(() => {
    return siteItem.value.iconPath
      ? `${BLOB_URL}/${siteItem.value.iconPath}`
      : "./img/icons/no_image_available.jpeg";
  });

  const computeBannerPath = computed(() => {
    return siteItem.value.bannerPath
      ? `${BLOB_URL}/${siteItem.value.bannerPath}`
      : "./img/icons/no_image_available.jpeg";
  });

  const favoriteItems = ref((LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[]);

  const isFavourite = computed(() => {
    const favItem = favoriteItems.value;
    return useArraySome(favItem, fav => fav.siteId == siteItem.value.siteId).value;
  });

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
