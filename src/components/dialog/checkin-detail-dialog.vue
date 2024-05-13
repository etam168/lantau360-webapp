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
        <app-dialog-title>{{ item.siteName }}</app-dialog-title>
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

            <q-item class="q-pa-none">
              <q-tab-panels v-model="tab" style="width: 100%; height: 100%">
                <q-tab-panel name="map" class="q-pa-none">
                  <q-card flat style="height: 430px; display: flex; justify-content: center">
                    <q-card-section>
                      <map-component
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
                <q-tab-panel name="checkInList">
                  <q-list class="q-gutter-md">
                    <q-item
                      v-for="(checkInfo, index) in checkInInfoList"
                      :key="index"
                      class="shadow-1 q-pa-sm q-mb-md"
                    >
                      <q-item-section>
                        <q-item-label>{{ checkInfo.checkInAt }}</q-item-label>
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
  import { CheckInView } from "@/interfaces/models/views/checkin-view";

  // Interface files
  //import { CheckIn } from "@/interfaces/models/entities/CheckIn";

  // .ts files
  import { BLOB_URL } from "@/constants";

  // 3rd Party Import
  import { LatLngExpression, latLngBounds } from "leaflet";

  const props = defineProps({
    item: {
      type: Object as PropType<CheckInView>,
      required: true
    }
  });

  const { translate, dateTimeFormatter } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const { locale, t } = useI18n({ useScope: "global" });
  const checkInItem = computed(() => props?.item as CheckInView);

  const isDialogVisible = ref();
  const $q = useQuasar();

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("map");

  const checkInInfoList = computed(() => {
    return checkInItem.value.checkInfo
      .map((item: any) => ({
        ...item,
        checkInAt: new Date(item.checkInAt)
      }))
      .sort((a: any, b: any) => b.checkInAt - a.checkInAt)
      .map((item: any) => ({
        ...item,
        checkInAt: dateTimeFormatter(new Date(item.checkInAt))
      }));
  });
  const tabItems = ref([
    { name: "map", label: t("more.checkIn.map") },
    { name: "checkInList", label: t("more.checkIn.checkInList") }
  ]);

  const bannerPath = computed(() => {
    return checkInItem.value.bannerPath
      ? `${BLOB_URL}/${checkInItem.value.bannerPath}`
      : "./img/icons/no_image_available.jpeg";
  });

  const address = computed(() =>
    translate(checkInItem.value.subtitle1, checkInItem.value.meta, "subtitle1")
  );

  const zoom = computed(() => {
    const screenWidth = $q.screen.width;

    if (screenWidth > 900) return 11.5;
    if (screenWidth > 450) return 11;

    return 10.5;
  });

  const markerPosition = computed<LatLngExpression>(() => [
    checkInItem.value.latitude,
    checkInItem.value.longitude
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
    const mapLabel = checkInItem.value.siteMeta?.i18n?.[locale.value]?.mapLabel;
    if (mapLabel !== undefined && mapLabel !== null) {
      return mapLabel;
    } else {
      return translate(checkInItem.value.siteName, props.item.siteMeta, "siteName");
    }
  });
</script>
