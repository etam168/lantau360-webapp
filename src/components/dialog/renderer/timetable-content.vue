<template>
  <app-tab-select
    :tab-items="tabItems"
    :current-tab="tab"
    @update:currentTab="setTab"
    class="items-center justify-center"
  />
  <q-item-section class="items-center justify-center">
    <q-item-label>
      <q-btn color="primary" text-color="white" icon="favorite" size="sm" round class="q-mr-md" />
      <q-btn color="primary" text-color="white" icon="phone" size="sm" round class="q-mr-md" />
      <q-btn color="primary" text-color="white" icon="fab fa-whatsapp" size="sm" round />
    </q-item-label>
  </q-item-section>

  <app-tab-panels v-model="tab">
    <q-tab-panel name="muiwo" class="q-pt-none">
      <q-img class="bg-blue" :src="computePath(item.imagePath)" />
    </q-tab-panel>

    <q-tab-panel name="central"><q-img :src="computePath(item.bannerPath)" /> </q-tab-panel>
  </app-tab-panels>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { Site } from "@/interfaces/models/entities/site";
  import { BLOB_URL } from "@/constants";
  import { TabItem } from "@/interfaces/tab-item";

  defineProps({
    item: {
      type: Object as PropType<Site>,
      required: true
    }
  });

  const { t } = useI18n({ useScope: "global" });
  const setTab = (val: string) => (tab.value = val);
  const tab = ref("muiwo");

  const tabItems = ref<TabItem[]>([
    { name: "muiwo", label: t("home.muiWo") },
    { name: "central", label: t("home.central") }
  ]);

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };
</script>
