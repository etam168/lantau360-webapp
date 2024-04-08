<template>
  <q-card flat class="location-card">
    <q-card-section
      class="location-card-section"
      :class="{ 'row no-wrap': $q.screen.gt.xs, column: !$q.screen.gt.xs }"
    >
      <map-component
        class="map-component"
        :style="{
          height: $q.screen.gt.xs ? '300px' : '200px',
          width: $q.screen.gt.xs ? '600px' : '100%'
        }"
        :zoom="zoom"
        :marker-position="markerPosition"
        :url="localMapUrl"
        :bounds="bounds"
        :tooltip="mapTooltip"
      />

      <div class="details-section">
        <q-item v-if="siteItem.subtitle1">
          <q-item-section avatar @click="openGoogleMaps">
            <q-avatar>
              <q-icon name="location_on" color="primary" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">{{
              translate(siteItem.subtitle1, siteItem.meta, "subtitle1")
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="siteItem.contactPhone">
          <q-item-section avatar @click="navigateToPhone">
            <q-avatar>
              <q-icon name="phone" color="primary" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">{{
              siteItem.contactPhone == undefined ? "N/A" : siteItem.contactPhone
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="siteItem.contactWhatsApp">
          <q-item-section avatar @click="navigateToWhatsApp(siteItem.contactWhatsApp)">
            <q-avatar>
              <q-icon name="fab fa-whatsapp" color="primary" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">{{
              siteItem.contactWhatsApp == undefined ? "N/A" : siteItem.contactWhatsApp
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { LatLngExpression, latLngBounds } from "leaflet";

  const { navigateToWhatsApp, translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const siteItem = computed(() => props?.item as SiteView);
  const $q = useQuasar();

  const zoom = computed(() => {
    const screenWidth = $q.screen.width;

    if (screenWidth > 900) return 11.5;
    if (screenWidth > 450) return 11;

    return 10.5;
  });
  const markerPosition = computed<LatLngExpression>(() => [
    siteItem.value.latitude,
    siteItem.value.longitude
  ]); //ref<LatLngExpression>([22.2544, 113.8642]);
  const localMapUrl = ref("/map-tiles/{z}/{x}/{y}.png");

  const gtXsBounds = latLngBounds([
    [22.04, 113.7],
    [22.5, 114.21]
  ]);

  const ltSmBounds = latLngBounds([
    [22.05, 113.66],
    [22.51, 114.23]
  ]);

  const bounds = computed(() => ($q.screen.lt.sm ? ltSmBounds : gtXsBounds));

  const mapTooltip = computed(() =>
    translate(siteItem.value.mapLabel, siteItem.value.meta, "mapLabel")
  );

  const navigateToPhone = () => {
    if (siteItem.value.contactPhone) {
      const phoneURL = `tel:${siteItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  const openGoogleMaps = () => {
    if (siteItem.value.meta?.["hasMap"]) {
      window.open(siteItem.value.meta?.["mapLink"], "_blank");
    } else {
      console.error("Map link not available");
    }
  };
</script>

<style scoped>
  .location-card {
    margin: 16px;
  }

  .location-card-section {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
  }

  .map-component {
    flex: 1;
  }

  .details-section {
    flex: 1;
    padding: 16px;
    max-width: 250px; /* Adjust the max-width as needed */
  }

  .text-caption {
    font-size: 14px;
  }

  @media only screen and (max-width: 600px) {
    .location-card-section {
      flex-direction: column;
    }

    .details-section {
      padding: 16px 0;
      max-width: none; /* Reset the max-width for small screens */
    }
  }
</style>
