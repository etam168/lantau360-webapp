<template>
  <q-item class="q-pa-none">
    <q-item-section>
      <div style="width: 100px; width: 100%">
        <q-responsive :ratio="16 / 9">
          <l-map
            :use-global-leaflet="false"
            ref="map"
            v-model:zoom="localZoom"
            :center="mapCenter"
            :options="mapOptions"
            :bounds="bounds"
          >
            <l-tile-layer :url="url" layer-type="base" name="OpenStreetMap"></l-tile-layer>

            <l-marker :lat-lng="markerPosition">
              <l-tooltip :options="{ permanent: true, interactive: true }">{{ tooltip }}</l-tooltip>
            </l-marker>

            <l-control position="bottomright">
              <div style="font-weight: 500">{{ bottomRightLabel }}</div>
            </l-control>
          </l-map>
        </q-responsive>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import "leaflet/dist/leaflet.css";
  import { LMap, LTileLayer, LMarker, LTooltip, LControl } from "@vue-leaflet/vue-leaflet";
  import { LatLngBounds, LatLngExpression } from "leaflet";

  // Props
  const {
    bounds,
    zoom = 12,
    url,
    markerPosition,
    tooltip = "Lantau360 Lite",
    bottomRightLabel = ""
  } = defineProps<{
    bounds: LatLngBounds;
    zoom?: number;
    url: string;
    markerPosition: LatLngExpression;
    tooltip?: string;
    bottomRightLabel?: String;
  }>();

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
  const mapCenter = ref<any>(bounds.getCenter());

  // Create a local reactive property for zoom
  const localZoom = ref(zoom);
</script>
