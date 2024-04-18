<template>
  <q-card class="my-card bg-grey-2" flat>
    <q-card-section horizontal class="justify-between">
      <q-card-section style="width: 100%" v-if="Number(siteItem.meta.maskValue) === 1">
        <q-card-section>
          <div class="text-h6 q-mb-xs">
            {{ translate(siteItem.subtitle1, siteItem.meta, "subtitle1") }} |
            {{ translate(siteItem.subtitle2, siteItem.meta, "subtitle2") }}
          </div>
          <q-img
            class="rounded-borders"
            :src="
              siteItem.bannerPath
                ? `${BLOB_URL}/${siteItem.bannerPath}`
                : './img/icons/no_image_available.jpeg'
            "
          />
        </q-card-section>
      </q-card-section>

      <q-card-section v-else style="width: 100%">
        <q-card-section v-for="(item, index) in items" :key="index">
          <div class="text-h5 q-mb-xs">{{ item.label }}</div>
          <div class="text-caption q-mb-xs" v-if="item.customSubtitle">
            {{ item.customSubtitle }}
          </div>

          <q-img class="rounded-borders" :src="item.image" />
        </q-card-section>
      </q-card-section>

      <q-card-section>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
        />
      </q-card-section>
    </q-card-section>
  </q-card>
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
    items.value = [
      {
        name: siteItem.value.subtitle1,
        label: translate(siteItem.value.subtitle1, siteItem.value.meta, "subtitle1"),
        customSubtitle: translate(
          siteItem.value.customSubtitle1,
          siteItem.value.meta,
          "customSubtitle1"
        ),
        image: siteItem.value.bannerPath
          ? `${BLOB_URL}/${siteItem.value.bannerPath}`
          : "./img/icons/no_image_available.jpeg"
      } as TabItem,
      {
        name: siteItem.value.subtitle2,
        label: translate(siteItem.value.subtitle2, siteItem.value.meta, "subtitle2"),
        customSubtitle: translate(
          siteItem.value.customSubtitle2,
          siteItem.value.meta,
          "customSubtitle2"
        ),
        image: siteItem.value.imagePath
          ? `${BLOB_URL}/${siteItem.value.imagePath}`
          : "./img/icons/no_image_available.jpeg"
      } as TabItem
    ];

    tab.value = siteItem.value.subtitle1;
  }

  const { translate } = useUtilities();

  // const setTab = (val: string) => (tab.value = val);
  const tab = ref(siteItem.value.subtitle1);

  const items = ref<TabItem[]>([
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
