<template>
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
      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
      /></q-item-section>
    </q-item>

    <q-item>
      <q-tab-panels v-model="tab" style="width: 100%; height: 100%">
        <q-tab-panel name="aboutUs" class="q-pa-none">
          <q-item v-if="shouldShowItem" class="q-pa-none">
            <q-item-section>
              <q-item-label class="q-mt-sm">
                <span
                  class="text-subtitle1"
                  :style="{
                    color: isCurrentTimeInRange(businessItem.openTime, businessItem.closeTime)
                      ? '#478d45'
                      : 'red'
                  }"
                >
                  {{
                    isCurrentTimeInRange(businessItem.openTime, businessItem.closeTime)
                      ? "Open now"
                      : "Close now"
                  }}
                </span>
                <q-icon size="0.9em" name="fiber_manual_record" />
                {{ formatTime(businessItem.openTime) }} - {{ formatTime(businessItem.closeTime) }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <app-text-editor v-model="translatedContent" />
        </q-tab-panel>

        <q-tab-panel name="info" class="q-pa-none">
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

              <q-list dense class="details-section">
                <q-item v-if="businessItem.contactPhone">
                  <q-item-section avatar @click="navigateToPhone">
                    <q-avatar>
                      <q-icon name="phone" color="primary" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption">{{
                      businessItem.contactPhone == undefined ? "N/A" : businessItem.contactPhone
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item v-if="businessItem.contactWhatsApp">
                  <q-item-section avatar @click="navigateToWhatsApp(businessItem.contactWhatsApp)">
                    <q-avatar>
                      <q-icon name="fab fa-whatsapp" color="primary" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption">{{
                      businessItem.contactWhatsApp == undefined
                        ? "N/A"
                        : businessItem.contactWhatsApp
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { LatLngExpression, latLngBounds } from "leaflet";

  // .ts files
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  const { navigateToWhatsApp, translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    },
    galleryImages: {
      type: Array as PropType<GalleryImageType[]>,
      required: true
    },
    isFavourite: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits(["on-favourite"]);
  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("aboutUs");
  const tabItems = ref([
    { name: "aboutUs", label: t("business.tabItems.aboutUs") },
    { name: "info", label: t("business.tabItems.info") }
  ]);

  const businessItem = computed(() => props?.item as BusinessView);

  const formatTime = (time: string | undefined) => {
    if (!time) return "";

    const parsedTime = new Date(`2000-01-01T${time}`);
    const formattedTime = parsedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return formattedTime;
  };

  const translatedContent: any = computed(() =>
    translate(businessItem.value.description, businessItem.value.meta, "description")
  );

  const address = computed(() =>
    translate(businessItem.value.subtitle1, businessItem.value.meta, "subtitle1")
  );

  const zoom = computed(() => {
    const screenWidth = $q.screen.width;

    if (screenWidth > 900) return 11.5;
    if (screenWidth > 450) return 11;

    return 10.5;
  });

  const markerPosition = computed<LatLngExpression>(() => [
    businessItem.value.latitude,
    businessItem.value.longitude
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
    const mapLabel = translate(businessItem.value.mapLabel, businessItem.value.meta, "mapLabel");
    if (mapLabel !== undefined && mapLabel !== null) {
      return mapLabel;
    } else {
      return translate(businessItem.value.businessName, props.item.meta, "businessName");
    }
  });

  const isCurrentTimeInRange = (
    startTime: string | undefined,
    endTime: string | undefined
  ): boolean => {
    if (!startTime || !endTime) return false;

    const now = new Date();
    const startHour = parseInt(startTime.split(":")[0]);
    const startMinute = parseInt(startTime.split(":")[1]);
    const endHour = parseInt(endTime.split(":")[0]);
    const endMinute = parseInt(endTime.split(":")[1]);

    const startTimeToday = new Date();
    startTimeToday.setHours(startHour, startMinute, 0);

    const endTimeToday = new Date();
    endTimeToday.setHours(endHour, endMinute, 0);

    // If the end time is earlier than the start time, assume it's for the next day
    if (endTimeToday < startTimeToday) {
      endTimeToday.setDate(endTimeToday.getDate() + 1);
    }

    return now >= startTimeToday && now <= endTimeToday;
  };

  const navigateToPhone = () => {
    if (businessItem.value.contactPhone) {
      const phoneURL = `tel:${businessItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  const shouldShowItem = computed(() => {
    return (
      businessItem.value.openTime !== null &&
      businessItem.value.openTime !== undefined &&
      businessItem.value.openTime !== "" &&
      businessItem.value.closeTime !== null &&
      businessItem.value.closeTime !== undefined &&
      businessItem.value.closeTime !== ""
    );
  });

  const onBtnFavClick = () => {
    emits("on-favourite");
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
