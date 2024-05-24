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
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { LatLngExpression, latLngBounds } from "leaflet";

  const { translate } = useUtilities();

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
  const $q = useQuasar();
  const emits = defineEmits(["open-map"]);

  const address = computed(() => translate(props.item.subtitle1, props.item.meta, "subtitle1"));

  const zoom = computed(() => {
    const screenWidth = $q.screen.width;

    if (screenWidth > 900) return 11.5;
    if (screenWidth > 450) return 11;

    return 10.5;
  });

  //ref<LatLngExpression>([22.2544, 113.8642]);
  const markerPosition = computed<LatLngExpression>(() => [
    props.item.latitude,
    props.item.longitude
  ]);

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
    const mapLabel = props.item.meta?.i18n?.[locale.value]?.mapLabel;
    if (mapLabel !== undefined && mapLabel !== null) {
      return mapLabel;
    } else {
      return props.defaultTooltip;
      //return translate(props.item.siteName, props.item.meta, "siteName");
    }
  });

  function openGoogleMaps() {
    emits("open-map");
  }
</script>
