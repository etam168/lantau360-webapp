<template>
  <q-card
    flat
    class="q-ma-md row justify-center"
    :style="{
      height: $q.screen.gt.xs ? '370px' : 'auto'
    }"
  >
    <q-card-section class="q-pa-none" :style="$q.screen.lt.sm ? 'width: 100%' : ''">
      <map-cotent :item="item" />
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";

  import MapCotent from "@/components/dialog/renderer/common/map-cotent.vue";

  defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });
</script>
