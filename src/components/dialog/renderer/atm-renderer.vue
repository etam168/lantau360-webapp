<template>
  <gallery-component :item="item" />
  <q-list padding class="q-pa-none q-pb-md" style="background-color: #f6f6f6">
    <q-item>
      <q-item-section></q-item-section>
      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
      /></q-item-section>
    </q-item>

    <q-list class="rounded-borders q-mx-lg">
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

            <q-card
              flat
              class="q-ma-md"
              :style="{
                height: $q.screen.gt.xs ? '370px' : 'auto'
              }"
            >
              <q-card-section
                class="justify-between q-pa-none"
                :class="{ 'row no-wrap': $q.screen.gt.xs, column: !$q.screen.gt.xs }"
                style="width: 100%"
              >
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

                <q-list
                  dense
                  style="max-width: 250px; flex: 1"
                  :class="$q.screen.gt.xs ? 'q-pa-md' : 'q-px-none q-py-md'"
                >
                  <q-item v-if="siteItem.contactPhone">
                    <q-item-section avatar @click="navigateToPhone">
                      <q-avatar>
                        <q-icon name="phone" color="primary" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-caption"
                        >{{ siteItem.contactPhone == undefined ? "N/A" : siteItem.contactPhone }}
                      </q-item-label></q-item-section
                    >
                  </q-item>

                  <q-item v-if="siteItem.contactWhatsApp">
                    <q-item-section avatar @click="navigateToWhatsApp(siteItem.contactWhatsApp)">
                      <q-avatar>
                        <q-icon name="fab fa-whatsapp" color="primary" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-caption"
                        >{{
                          siteItem.contactWhatsApp == undefined ? "N/A" : siteItem.contactWhatsApp
                        }}
                      </q-item-label></q-item-section
                    >
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  //UI Component
  import GalleryComponent from "@/components/dialog/renderer/common/gallery-component.vue";

  // Third party files
  import { LatLngExpression, latLngBounds } from "leaflet";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  const { navigateToWhatsApp, translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    },
    isFavourite: {
      type: Boolean,
      default: false
    }
  });

  const $q = useQuasar();
  const { locale, t } = useI18n({ useScope: "global" });
  const emits = defineEmits(["on-favourite"]);

  const siteItem = computed(() => props?.item as SiteView);

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
      console.error(t("errors.mapLinkNotAvailable"));
    }
  };

  const onBtnFavClick = () => {
    emits("on-favourite");
  };

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
</script>
