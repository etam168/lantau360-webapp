<template>
  <q-card flat class="my-card bg-white">
    <q-card-section :horizontal="$q.screen.gt.md">
      <!-- <q-card-section class="col-6">
        <floor-plan :imagePath="rowData.imagePath" />
      </q-card-section> -->

      <q-card-section class="col-5">
        <weather-info />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, computed, provide } from "vue";

  // .ts files
  import { WeatherDatatable } from "@/interfaces/datatable/weather-datatable";

  // Custom Components
  //import FloorPlan from "../shared/preview-pane/floor-plan-image.vue";
  import WeatherInfo from "../shared/preview-pane/weather-info.vue";

  const props = defineProps({
    rowData: {
      type: Object as PropType<WeatherDatatable>,
      required: true
    }
  });

  const previewWeather = computed(() => {
    return props.rowData;
  });

  provide("previewWeather", previewWeather);
</script>
