<template>
  <div>
    <q-item class="q-pa-none">
      <q-item-section>
        <div style="width: 100px; width: 100%">
          <q-responsive :ratio="16 / 9">
            <l-map
              :use-global-leaflet="false"
              ref="map"
              v-model:zoom="zoom"
              :center="mapCenter"
              :options="mapOptions"
              :bounds="bounds"
            >
              <l-tile-layer :url="url" layer-type="base" name="OpenStreetMap"></l-tile-layer>
              <l-marker :lat-lng="markerPosition">
                <l-tooltip :options="{ permanent: true, interactive: true }">{{
                  tooltip
                }}</l-tooltip>
              </l-marker>
              <l-control position="bottomright">
                <div style="font-weight: 500">{{ bottomRightLabel }}</div>
              </l-control>
            </l-map>
          </q-responsive>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import "leaflet/dist/leaflet.css";
  import { LMap, LTileLayer, LMarker, LTooltip, LControl } from "@vue-leaflet/vue-leaflet";
  import { LatLngBounds, LatLngExpression } from "leaflet";

  const props = defineProps({
    bounds: {
      type: LatLngBounds,
      required: true
    },
    zoom: {
      type: Number,
      default: 12
    },
    url: {
      type: String,
      required: true
    },
    markerPosition: {
      type: Object as PropType<LatLngExpression>,
      required: true
    },
    tooltip: {
      type: String,
      default: "Lantau Lite"
    },
    bottomRightLabel: {
      type: String,
      defualt: ""
    }
  });

  const mapOptions = {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
    keyboard: false,
    dragging: false,
    tap: false,
    zoomSnap: 0.5
  };

  const map = ref();
  const mapCenter = ref<any>(props.bounds.getCenter());
  const zoom = ref(props.zoom);
  onMounted(() => {});
</script>

<style></style>
