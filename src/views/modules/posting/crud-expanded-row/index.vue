<template>
  <q-card flat bordered class="bg-grey-2">
    <q-splitter
      v-model="splitterModel"
      style="min-width: 640px; max-width: 640px"
      :limits="[100, 100]"
      unit="px"
      after-class="scroll overflow-auto"
      before-class="scroll overflow-auto"
    >
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-green">
          <q-tab name="listing" icon="mdi-format-list-text" label="Listing" />
          <q-tab name="content" icon="mdi-script-text-outline" label="Content" />
          <q-tab name="gallery" icon="movie" label="Gallery" />
          <q-tab name="lang" icon="movie" label="Data" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="listing">
            <div class="text-h6 text-weight-regular">{{ $t("posting.expansion.siteListing") }}</div>
            <posting-list :rowData="rowData"></posting-list>
          </q-tab-panel>

          <q-tab-panel name="content">
            <div class="text-h6 text-weight-regular">{{ $t("posting.expansion.siteContent") }}</div>
            <posting-content :rowData="rowData"></posting-content>
          </q-tab-panel>

          <q-tab-panel name="gallery">
            <posting-gallery :rowData="rowData" />
          </q-tab-panel>

          <q-tab-panel name="lang">
            <q-card flat bordered style="min-width: 360px" class="bg-white">
              <q-card-section>
                <app-card-title>Localization</app-card-title>
                <vue-json-pretty :data="localization" />
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-card>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from "vue";
  import "vue-json-pretty/lib/styles.css";

  import PostingContent from "./posting-content.vue";
  import PostingGallery from "./posting-gallery.vue";
  import PostingList from "./posting-list.vue";

  // Custom Components
  import AppCardTitle from "@/components/widgets/app-card-title.vue";
  import VueJsonPretty from "vue-json-pretty";

  export default defineComponent({
    name: "CrudExpandedRow",
    inheritAttrs: false,

    components: {
      PostingContent,
      PostingList,
      PostingGallery,
      AppCardTitle,
      VueJsonPretty
    },

    props: {
      props: {
        type: Object
      }
    },

    setup(props) {
      const splitterModel = ref(100);

      const tab = ref("listing");
      const rowData = computed(() => props.props.row);

      const localization = computed(() => {
        return (rowData.value.meta?.["i18n"] ?? {}) as Record<string, unknown>;
      });

      return {
        localization,
        rowData,
        splitterModel,
        tab
      };
    }
  });
</script>
