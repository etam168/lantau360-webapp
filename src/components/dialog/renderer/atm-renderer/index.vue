<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section top>
        <app-tab-select
          :tab-items="tabItems"
          :current-tab="tab"
          @update:currentTab="setTab"
          class="q-pl-none"
        />
      </q-item-section>
      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
      /></q-item-section>
    </q-item>

    <q-item>
      <q-tab-panels v-model="tab" style="width: 100%; height: 100%">
        <q-tab-panel name="aboutUs" class="q-pa-none">
          <app-text-editor v-model="translatedContent" />
        </q-tab-panel>

        <q-tab-panel name="info" class="q-pa-none">
          <info-tab :item="item" />
        </q-tab-panel>

        <q-tab-panel name="checkIn" class="q-pa-none"> <chekc-in-tab :item="item" /> </q-tab-panel>
      </q-tab-panels>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import InfoTab from "./detail-tabs/info-tab.vue";
  import ChekcInTab from "./detail-tabs/check-in-tab/index.vue";
  import { useGeolocation } from "@vueuse/core";

  const { coords } = useGeolocation();
  const { translate } = useUtilities();

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

  const { t } = useI18n({ useScope: "global" });
  const siteItem = computed(() => props?.item as SiteView);
  provide("userPosition", coords);
  const setTab = (val: string) => (tab.value = val);
  const tab = ref("aboutUs");
  const tabItems = ref([
    { name: "aboutUs", label: t("home.tabItems.aboutUs") },
    { name: "info", label: t("home.tabItems.info") },
    { name: "checkIn", label: t("home.tabItems.checkin") }
  ]);

  const translatedContent: any = computed(() =>
    translate(siteItem.value.description, siteItem.value.meta, "description")
  );

  const onBtnFavClick = () => {
    emits("on-favourite");
  };
</script>
