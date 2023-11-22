<template>
  <q-card
    class="my-card text-white q-ma-lg"
    style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
  >
    <q-card-section>
      <q-item>
        <q-item-section top>
          <i class="fa-regular fa-solid fa-cloud text-h2"></i>
          <q-item-label class="text-weight-medium text-h6">{{ data?.caption }}</q-item-label>
          <q-item-label class="text-subtitle1">{{ data?.forecastDateTime }}</q-item-label>
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
  import { PropType } from "vue";

  // .ts file
  import { Weather } from "@/interfaces/models/entities/weather";
  defineProps({
    data: {
      type: Object as PropType<Weather | null>,
      required: false,
      default: null
    }
  });
</script>
