<template>
  <q-card class="my-card bg-grey-2" flat v-if="Number(siteItem.meta.maskValue) === 1">
    <q-card-section horizontal class="justify-between">
      <q-card-section style="width: 100%" class="q-pb-none">
        <div class="text-h6 q-mb-xs">
          {{ translate(siteItem.subtitle1, siteItem.meta, "subtitle1") }} |
          {{ translate(siteItem.subtitle2, siteItem.meta, "subtitle2") }}
        </div>
      </q-card-section>

      <q-card-section>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
        />
      </q-card-section>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-img class="rounded-borders" :src="getImageURL(siteItem.bannerPath)" />
    </q-card-section>
  </q-card>

  <q-card class="my-card bg-grey-2" flat v-else>
    <q-card-section horizontal class="justify-between">
      <q-card-section style="width: 100%" class="q-pb-none">
        <div class="text-h6 q-mb-xs" v-if="siteItem.meta?.i18n?.[locale]?.customSubtitle1">
          {{ translate(siteItem.customSubtitle1, siteItem.meta, "customSubtitle1") }}
        </div>

        <div class="text-h6 q-mb-xs" v-else>
          {{ translate(siteItem.subtitle1, siteItem.meta, "subtitle1") }}
        </div>
      </q-card-section>

      <q-card-section>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
        />
      </q-card-section>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-img class="rounded-borders" :src="getImageURL(siteItem.bannerPath)" />
    </q-card-section>

    <q-card-section class="q-py-none">
      <div class="text-h6 q-mb-xs" v-if="siteItem.meta?.i18n?.[locale]?.customSubtitle2">
        {{ translate(siteItem.customSubtitle2, siteItem.meta, "customSubtitle2") }}
      </div>

      <div class="text-h6 q-mb-xs" v-else>
        {{ translate(siteItem.subtitle2, siteItem.meta, "subtitle2") }}
      </div>

      <q-card-section class="q-px-none">
        <q-img class="rounded-borders" :src="getImageURL(siteItem.imagePath)" />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { TabItem } from "@/interfaces/tab-item";

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
  const { locale } = useI18n({ useScope: "global" });
  const { getImageURL } = useUtilities();
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
        image: getImageURL(siteItem.value.bannerPath)
      } as TabItem,
      {
        name: siteItem.value.subtitle2,
        label: translate(siteItem.value.subtitle2, siteItem.value.meta, "subtitle2"),
        customSubtitle: translate(
          siteItem.value.customSubtitle2,
          siteItem.value.meta,
          "customSubtitle2"
        ),
        image: getImageURL(siteItem.value.imagePath)
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
