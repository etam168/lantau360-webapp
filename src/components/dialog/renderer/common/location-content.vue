<template>
  <q-card>
    <q-expansion-item
      :label="$t('home.location')"
      group="siteGroup"
      expand-icon-toggle
      expand-separator
      dense-toggle
      default-opened
      header-class="text-h6"
    >
      <q-card
        flat
        class="row justify-center"
        :style="{
          height: $q.screen.gt.xs ? '370px' : 'auto'
        }"
      >
        <q-card-section>
          <app-map-component
            style="flex: 1"
            :style="mapComponentStyle"
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
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { LatLngExpression, latLng, latLngBounds } from "leaflet";

  const emits = defineEmits(["open-map"]);
  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    },
    defaultTooltip: {
      type: String,
      required: true
    }
  });

  const { locale } = useI18n({ useScope: "global" });
  const { translate } = useUtilities();
  const $q = useQuasar();

  const address = computed(() => translate(props.item.subtitle1, props.item.meta, "subtitle1"));

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

  const markerPosition = computed<LatLngExpression>(() => [
    props.item.latitude,
    props.item.longitude
  ]);

  const localMapUrl = ref("/map-tiles/{z}/{x}/{y}.png");
  const gtXsBounds = latLngBounds(latLng(22.04, 113.7), latLng(22.5, 114.21));
  const ltSmBounds = latLngBounds(latLng(22.05, 113.66), latLng(22.51, 114.23));
  const bounds = computed(() => ($q.screen.lt.sm ? ltSmBounds : gtXsBounds));

  const mapTooltip = computed(() => {
    const mapLabel = props.item.meta?.i18n?.[locale.value]?.mapLabel;
    if (mapLabel !== undefined && mapLabel !== null) {
      return mapLabel;
    } else {
      return props.defaultTooltip;
    }
  });

  const mapComponentStyle = computed(() => ({
    height: $q.screen.gt.xs ? "300px" : "200px",
    width: $q.screen.gt.xs ? "600px" : "100%"
  }));
  function openGoogleMaps() {
    emits("open-map");
  }
</script>
