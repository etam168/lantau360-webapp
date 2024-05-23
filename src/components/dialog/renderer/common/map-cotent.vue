<template>
  <map-component
    style="flex: 1"
    :style="{
      height: $q.screen.gt.xs ? '300px' : '200px',
      width: $q.screen.gt.xs ? '600px' : '100%'
    }"
    :zoom="zoom"
    :marker-position="markerPosition"
    :url="localMapUrl"
    :bounds="bounds"
    :tooltip="mapTooltip"
    :bottom-right-label="address"
    @click="openGoogleMaps()"
  />
</template>
<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { LatLngExpression, latLngBounds } from "leaflet";

  const { translate, notify } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { locale, t } = useI18n({ useScope: "global" });
  const siteItem = computed(() => props?.item as SiteView);
  const $q = useQuasar();
  const address = computed(() =>
    translate(siteItem.value.subtitle1, siteItem.value.meta, "subtitle1")
  );

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

  const mapTooltip = computed(() => {
    const mapLabel = siteItem.value.meta?.i18n?.[locale.value]?.mapLabel;
    if (mapLabel !== undefined && mapLabel !== null) {
      return mapLabel;
    } else {
      return translate(siteItem.value.siteName, props.item.meta, "siteName");
    }
  });

  const openGoogleMaps = () => {
    if (siteItem.value.meta?.["hasMap"]) {
      window.open(siteItem.value.meta?.["mapLink"], "_blank");
    } else {
      notify(t("errors.mapLinkNotAvailable"), "negative");
      console.error(t("errors.mapLinkNotAvailable"));
    }
  };
</script>
