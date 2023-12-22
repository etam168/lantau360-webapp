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
        <div class="q-gutter-sm">
          <q-btn color="primary" text-color="white" icon="phone" size="sm" round />
          <q-btn color="primary" text-color="white" icon="fab fa-whatsapp" size="sm" round />
          <q-btn color="primary" text-color="white" icon="favorite" size="sm" round />
        </div>
      </q-item-section>
    </q-item>

    <app-tab-panels v-model="tab">
      <q-tab-panel :name="item.subtitle1" class="q-pa-none">
        <q-scroll-area style="height: calc(100vh - 110px)">
          <q-img :src="computePath(item.imagePath)" />
        </q-scroll-area>
      </q-tab-panel>

      <q-tab-panel :name="item.subtitle2" class="q-pa-none"
        ><q-img :src="computePath(item.bannerPath)" />
      </q-tab-panel>
    </app-tab-panels>
  </q-card-section>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { Site } from "@/interfaces/models/entities/site";
  import { BLOB_URL } from "@/constants";
  import { TabItem } from "@/interfaces/tab-item";

  const props = defineProps({
    item: {
      type: Object as PropType<Site>,
      required: true
    }
  });

  const { translate } = useUtilities();

  // const { t } = useI18n({ useScope: "global" });
  const setTab = (val: string) => (tab.value = val);
  const tab = ref(props.item.subtitle1);

  const tabItems = ref<TabItem[]>([
    {
      name: props.item.subtitle1,
      label: translate(props.item.subtitle1, props.item.meta, "subtitle1")
    },
    {
      name: props.item.subtitle2,
      label: translate(props.item.subtitle2, props.item.meta, "subtitle2")
    }
  ]);

  // :address="translate(item.subtitle1, item.meta, 'subtitle1')"

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };
</script>
