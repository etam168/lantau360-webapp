<template>
  <q-list dense bordered class="full-height q-py-md">
    <!-- Weather Name -->
    <q-toolbar>
      <q-toolbar-title class="text-subtitle1">Weather</q-toolbar-title>
    </q-toolbar>

    <q-item v-for="(name, index) in names" :key="index" dense>
      <q-item-section side>
        <q-avatar size="sm" color="primary" text-color="white">{{ name.avatar }}</q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">
          {{ name.text }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { Ref, computed, inject } from "vue";

  //.ts files
  import { WeatherDatatable } from "@/interfaces/datatable/weather-datatable";
  import { useUtilities } from "@/composable/use-utilities";

  const { translateAltName } = useUtilities();

  //Injected data
  const previewWeather = inject("previewWeather") as Ref<WeatherDatatable>;

  const names = computed(() => [
    { text: previewWeather.value.caption, avatar: "En" },
    {
      text: translateAltName("hk", previewWeather.value.meta, "caption"),
      avatar: "繁"
    },
    {
      text: translateAltName("cn", previewWeather.value.meta, "caption"),
      avatar: "简"
    }
  ]);
</script>
