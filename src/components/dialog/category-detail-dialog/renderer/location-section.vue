<template>
  <q-card>
    <q-expansion-item
      group="itemGroup"
      class="q-px-sm"
      expand-icon-toggle
      dense-toggle
      default-opened
    >
      <template v-slot:header>
        <q-item-section class="text-h6">
          {{ $t(`${i18nKey}.location`) }}
        </q-item-section>

        <q-item-section side v-if="hasCheckIn">
          <q-btn flat color="primary" @click="onBtnCheckInClick">Check-In</q-btn>
        </q-item-section>
      </template>

      <q-separator />

      <q-card
        flat
        class="row justify-center"
        :style="{
          height: $q.screen.gt.xs ? '370px' : '100%'
        }"
      >
        <q-card-section :style="mapComponentStyle">
          <app-map-component
            style="flex: 1"
            :zoom="zoom"
            :marker-position="markerPosition"
            :url="localMapUrl"
            :bounds="bounds"
            :tooltip="mapTooltip"
            :bottom-right-label="address"
            @click="openGoogleMaps()"
          />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
  import { EntityURLKey } from "@/constants";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { LatLngExpression, latLng, latLngBounds } from "leaflet";

  const emits = defineEmits(["open-map", "check-in"]);

  // Props
  const {
    category,
    entityKey,
    hasCheckIn = false,
    tooltip
  } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    hasCheckIn?: boolean;
    tooltip?: string;
  }>();

  // const props = defineProps({
  //   item: {
  //     type: Object as PropType<CategoryTypes>,
  //     required: true
  //   },
  //   defaultTooltip: {
  //     type: String,
  //     required: true
  //   },
  //   canCheckIn: {
  //     type: Boolean,
  //     default: false
  //   }
  // });

  const { locale } = useI18n({ useScope: "global" });
  const { translate } = useUtilities();
  const $q = useQuasar();

  const i18nKey = "home";
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

  const localMapUrl = ref("/map-tiles/{z}/{x}/{y}.png");
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
    height: $q.screen.gt.xs ? "300px" : "230px",
    width: $q.screen.gt.xs ? "600px" : "100%"
  }));

  function onBtnCheckInClick() {
    emits("check-in");
  }

  function openGoogleMaps() {
    emits("open-map");
  }
</script>
