<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ $t("more.checkIn.detail") }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-img :ratio="16 / 9" :src="bannerPath" />

          <q-list padding class="q-mx-sm q-pa-none">
            <q-item>
              <q-item-section top>
                <app-tab-select
                  :tab-items="tabItems"
                  :current-tab="tab"
                  @update:currentTab="setTab"
                  class="q-pl-none"
                />
              </q-item-section>
            </q-item>

            <q-item>
              <q-tab-panels v-model="tab" style="width: 100%; height: 100%">
                <q-tab-panel name="map" class="q-pa-none">
                  <q-card flat class="location-card" style="height: 430px">
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
                        :bottom-right-label="address"
                      />
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="history" class="q-pa-none">
                  <q-list class="q-gutter-md">
                    <q-item v-for="(checkInfo, index) in data.checkInfo" :key="index">
                      <q-item-section>
                        <q-item-label>{{
                          new Date(checkInfo.checkInAt).toLocaleString()
                        }}</q-item-label>
                        <q-item-label lines="2" caption>{{ checkInfo.description }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-tab-panel>
              </q-tab-panels>
            </q-item>
          </q-list>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  // Interface files
  //import { CheckIn } from "@/interfaces/models/entities/CheckIn";

  // .ts files
  import { BLOB_URL } from "@/constants";

  // 3rd Party Import
  import { LatLngExpression, latLngBounds } from "leaflet";

  const props = defineProps({
    data: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const { translate } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("map");
  const tabItems = ref([
    { name: "map", label: t("more.checkIn.map") },
    { name: "history", label: t("more.checkIn.history") }
  ]);

  const bannerPath = computed(() => {
    return props.data.bannerPath
      ? `${BLOB_URL}/${props.data.bannerPath}`
      : "./img/icons/no_image_available.jpeg";
  });
  const address = computed(() => translate(props.data.subtitle1, props.data.meta, "subtitle1"));

  const zoom = computed(() => {
    const screenWidth = $q.screen.width;

    if (screenWidth > 900) return 11.5;
    if (screenWidth > 450) return 11;

    return 10.5;
  });

  const markerPosition = computed<LatLngExpression>(() => [
    props.data.latitude,
    props.data.longitude
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

  const mapTooltip = computed(() => translate(props.data.mapLabel, props.data.meta, "mapLabel"));
</script>
