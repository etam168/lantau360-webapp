<template>
  <q-list dense>
    <template v-for="(weather, index) in weathers" :key="index">
      <q-item>
        <q-item-section>
          <vee-input
            :name="weather.name"
            :maxlength="weather.maxlength"
            counter
            stack-label
            :label="$t(weather.label)"
          />
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";

  //import { translateFeatures } from "@/composable/use-search-bar-options";
  // Custom Components
  import VeeInput from "@/components/vee-validate/vee-input.vue";

  const weathers = ref([
    { name: "iconNo", label: "weather.columns.iconNo", maxlength: 20 },
    { name: "caption", label: "weather.columns.caption", maxlength: 20 },
    { name: "captionHk", label: "weather.columns.captionHk", maxlength: 16 },
    { name: "captionCn", label: "weather.columns.captionCn", maxlength: 16 }
  ]);
</script>
