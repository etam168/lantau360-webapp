<template>
  <q-card flat bordered class="bg-grey-2">
    <q-splitter
      v-model="splitterModel"
      style="min-width: 1200px; max-width: 1200px"
      :limits="[splitter_width, splitter_width]"
      unit="px"
      after-class="scroll overflow-auto"
      before-class="scroll overflow-auto"
    >
      <template v-slot:before>
        <site-content :rowData="rowData"></site-content>
      </template>

      <template v-slot:after>
        <image-gallery :rowData="rowData" />
      </template>
    </q-splitter>
  </q-card>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import "vue-json-pretty/lib/styles.css";

  // Custom Components
  import SiteContent from "./site-content.vue";
  // import SiteGallery from "./site-gallery.vue";
  import ImageGallery from "./images-section/index.vue";

  const props = defineProps({
    props: {
      type: Object
    }
  });

  const splitter_width = 560;
  const splitterModel = ref(splitter_width);

  const rowData = computed(() => props?.props?.row);
</script>
