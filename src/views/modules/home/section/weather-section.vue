<template>
  <q-card class="my-card text-white q-ma-md" style="background: #009ef7">
    <q-card-section>
      <q-item class="q-pa-none">
        <q-item-section top>
          <i class="fa-regular fa-solid fa-cloud text-h2"></i>
          <q-item-label class="text-weight-medium text-h6">{{ data?.caption }}</q-item-label>
          <q-item-label class="text-subtitle1">{{ weatherDate }}</q-item-label>
        </q-item-section>

        <q-item-section top side>
          <q-item-label class="text-weight-medium text-h4 text-white">{{
            data?.tempValue + "°" + data?.unit
          }}</q-item-label>
          <q-item-label>
            <q-item-label class="text-white"
              >{{ data?.minTemp + "°" + data?.unit }}
              <i class="fa-sharp fa-solid fa-arrow-up text-white"></i>
            </q-item-label>
            <q-item-label class="text-white"
              >{{ data?.maxTemp + "°" + data?.unit }}
              <i class="fa-sharp fa-solid fa-arrow-down text-white"></i>
            </q-item-label>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType, computed } from "vue";
  import { date } from "quasar";
  // .ts file
  import { Weather } from "@/interfaces/models/entities/weather";
  const props = defineProps({
    data: {
      type: Object as PropType<Weather | null>,
      required: false,
      default: null
    }
  });

  const weatherDate = computed(() =>
    date.formatDate(props.data?.forecastDateTime, "YYYY-MM-DD HH:MM")
  );
</script>
