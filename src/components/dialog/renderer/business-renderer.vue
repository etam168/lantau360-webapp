<template>
  <q-list padding class="q-pa-none q-pb-md" style="background-color: #f6f6f6">
    <q-item>
      <q-item-section>
        <q-item-label class="q-mt-sm q-ml-sm" v-if="shouldShowItem">
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
          {{ formatTime(businessItem.openTime) }} -
          {{ formatTime(businessItem.closeTime) }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
      /></q-item-section>
    </q-item>

    <q-list class="rounded-borders q-mx-lg">
      <q-card class="q-mb-md" v-if="translatedContent != null && translatedContent != ''">
        <q-card-section class="q-pa-sm">
          <q-expansion-item
            :label="$t('home.description')"
            group="siteGroup"
            dense
            dense-toggle
            header-class="text-h6"
          >
            <q-separator />

            <q-card>
              <q-card-section class="q-pa-none">
                <app-text-editor v-model="translatedContent" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section class="q-pa-sm">
          <q-expansion-item
            :label="$t('home.location')"
            group="siteGroup"
            dense
            dense-toggle
            default-opened
            header-class="text-h6"
          >
            <q-separator />

            <q-card>
              <q-card-section
                class="location-card"
                :style="{
                  height: $q.screen.gt.xs ? '370px' : 'auto'
                }"
              >
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
                    @click="openGoogleMaps()"
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
                      <q-item-section
                        avatar
                        @click="navigateToWhatsApp(businessItem.contactWhatsApp)"
                      >
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
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { LatLngExpression, latLngBounds } from "leaflet";

  // .ts files
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  const { navigateToWhatsApp, translate, notify } = useUtilities();

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
  const { locale } = useI18n({ useScope: "global" });
  const $q = useQuasar();

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
    const mapLabel = businessItem.value.meta?.i18n?.[locale.value]?.mapLabel;
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

  const openGoogleMaps = () => {
    if (businessItem.value.meta?.["hasMap"]) {
      debugger;
      window.open(businessItem.value.meta?.["mapLink"], "_blank");
    } else {
      notify("Map link not available", "negative");
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
