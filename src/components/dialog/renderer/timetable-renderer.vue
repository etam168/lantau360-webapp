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
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
      /></q-item-section>
    </q-item>

    <q-tab-panels v-model="tab">
      <q-tab-panel
        v-for="(tabItem, index) in tabItems"
        :key="index"
        :name="tabItem.name"
        class="q-pa-none"
      >
        <q-img :src="tabItem.image" />
      </q-tab-panel>
    </q-tab-panels>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { TabItem } from "@/interfaces/tab-item";

  // .ts files
  import { BLOB_URL } from "@/constants";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    },
    isFavourite: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits(["on-favourite"]);

  const siteItem = computed(() => props.item as SiteView);

  onMounted(() => {
    // Need both onMounted and onUpdated to work!!
    initTabItems();
  });

  onUpdated(() => {
    // Need both onMounted and onUpdated to work!!
    initTabItems();
  });

  function initTabItems() {
    tabItems.value = [
      {
        name: siteItem.value.subtitle1,
        label: translate(siteItem.value.subtitle1, siteItem.value.meta, "subtitle1"),
        image: siteItem.value.bannerPath
          ? `${BLOB_URL}/${siteItem.value.bannerPath}`
          : "./img/icons/no_image_available.jpeg"
      } as TabItem,
      {
        name: siteItem.value.subtitle2,
        label: translate(siteItem.value.subtitle2, siteItem.value.meta, "subtitle2"),
        image: siteItem.value.imagePath
          ? `${BLOB_URL}/${siteItem.value.imagePath}`
          : "./img/icons/no_image_available.jpeg"
      } as TabItem
    ];

    tab.value = siteItem.value.subtitle1;
  }

  const { translate } = useUtilities();

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

  const onBtnFavClick = () => {
    emits("on-favourite");
  };
</script>
