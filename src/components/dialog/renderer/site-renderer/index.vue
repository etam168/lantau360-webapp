<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section></q-item-section>
      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
      /></q-item-section>
    </q-item>

    <q-list bordered class="rounded-borders q-mx-lg q-mb-xl">
      <q-expansion-item group="siteGroup" dense dense-toggle>
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar size="24px" color="primary" text-color="white"></q-avatar>
          </q-item-section>
          <q-item-section> Description </q-item-section>
        </template>
        <app-text-editor v-model="translatedContent" />
      </q-expansion-item>

      <q-expansion-item group="siteGroup" dense dense-toggle default-opened>
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar size="24px" color="primary" text-color="white"></q-avatar>
          </q-item-section>

          <q-item-section> Location </q-item-section>
        </template>
        <info-tab :item="item" />
      </q-expansion-item>
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import InfoTab from "./detail-tabs/info-tab.vue";

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

  const siteItem = computed(() => props?.item as SiteView);
  // provide("userPosition", coords);

  const translatedContent: any = computed(() =>
    translate(siteItem.value.description, siteItem.value.meta, "description")
  );

  const onBtnFavClick = () => {
    emits("on-favourite");
  };
</script>
