<template>
  <q-card class="q-ma-md">
    <q-expansion-item
      group="itemGroup"
      class="detail-page-expansion"
      dense-toggle
      default-opened
      expand-icon-toggle
      :expand-icon="fasAngleDown"
    >
      <template v-slot:header>
        <q-item-section class="text-h6">
          {{ $t(`${i18nKey}.location`) }}
        </q-item-section>

        <!-- <q-item-section side v-if="hasCheckIn">
          <q-btn dense unelevated flat color="primary" @click="onBtnCheckInClick" class="q-pa-none"
            >Check-In</q-btn
          >
        </q-item-section> -->
      </template>

      <q-separator />

      <q-card
        flat
        class="row justify-center"
        :style="{
          height: $q.screen.gt.xs ? '350px' : '100%'
        }"
      >
        <q-card-section :style="mapComponentStyle" @click="openGoogleMaps()" class="q-pa-md">
          <app-map-component
            style="flex: 1"
            :zoom="zoom"
            :marker-position="markerPosition"
            :url="localMapUrl"
            :bounds="bounds"
            :tooltip="mapTooltip"
            :bottom-right-label="address"
          />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasAngleDown } from "@quasar/extras/fontawesome-v6";
  import { LatLngExpression, latLng, latLngBounds } from "leaflet";

  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  //Emit
  const emits = defineEmits(["open-map", "check-in"]);

  // Props
  const { category, hasCheckIn = false } = defineProps<{
    category: CategoryTypes;
    hasCheckIn?: boolean;
  }>();

  // Composable function calls
  const $q = useQuasar();
  const { locale } = useI18n({ useScope: "global" });

  const { translate } = useUtilities(locale.value);

  // Reactive variables
  const i18nKey = "home.dialog";
  const address = computed(() => translate(category.subtitle1, category.meta, "subtitle1"));

  const zoom = computed(() => {
    switch (true) {
      case $q.screen.gt.md:
        return 11.5;
      case $q.screen.gt.sm:
        return 11;
      default:
        return 10.5;
    }
  });

  const markerPosition = computed<LatLngExpression>(() => [category.latitude, category.longitude]);

  const localMapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const gtXsBounds = latLngBounds(latLng(22.04, 113.7), latLng(22.5, 114.21));
  const ltSmBounds = latLngBounds(latLng(22.05, 113.66), latLng(22.51, 114.23));
  const bounds = computed(() => ($q.screen.lt.sm ? ltSmBounds : gtXsBounds));

  const mapTooltip = computed(() => {
    const mapLabel = category.meta?.i18n?.[locale.value]?.mapLabel;
    if (mapLabel !== undefined && mapLabel !== null) {
      return mapLabel;
    } else {
      return "";
      // return tooltip;
    }
  });

  const mapComponentStyle = computed(() => ({
    height: $q.screen.gt.xs ? "300px" : "216px",
    width: $q.screen.gt.xs ? "600px" : "100%"
  }));

  function onBtnCheckInClick() {
    emits("check-in");
  }

  function openGoogleMaps() {
    emits("open-map");
  }
</script>
