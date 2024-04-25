<template>
  <q-list padding class="q-pa-none" style="background-color: #f6f6f6">
    <q-item>
      <q-item-section></q-item-section>
      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
      /></q-item-section>
    </q-item>

    <q-list class="rounded-borders q-mx-lg q-mb-xl">
      <q-item-section class="q-mb-md"> {{ $t("home.description") }} </q-item-section>

      <q-card>
        <q-card-section class="q-pa-sm">
          <q-expansion-item group="siteGroup" dense dense-toggle>
            <app-text-editor v-model="translatedContent" class="q-pa-md" />
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <q-item-section class="q-my-sm"> {{ $t("home.location") }} </q-item-section>

      <q-card>
        <q-card-section class="q-pa-sm">
          <q-expansion-item group="siteGroup" dense dense-toggle default-opened>
            <info-tab :item="item" style="background-color: #f6f6f6" />
          </q-expansion-item>
        </q-card-section>
      </q-card>
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
