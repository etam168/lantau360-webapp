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
    </q-item>

    <q-item>
      <q-tab-panels v-model="tab" style="width: 100%; height: 100%">
        <q-tab-panel name="aboutUs" class="q-pa-none">
          <app-text-editor v-model="translatedContent" />
        </q-tab-panel>

        <q-tab-panel name="info" class="q-pa-none">
          <q-item class="q-pa-none">
            <q-item-section v-if="shouldShowImage && mapImagePath">
              <q-img
                style="cursor: pointer"
                :ratio="16 / 9"
                width="100%"
                :src="mapImagePath"
                @click="openGoogleMaps"
              >
              </q-img>

              <q-list dense v-if="$q.screen.xs">
                <q-item dense v-if="siteItem.subtitle1">
                  <q-item-section avatar @click="openGoogleMaps">
                    <q-avatar>
                      <q-icon name="location_on" color="primary" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption"
                      >{{ translate(siteItem.subtitle1, siteItem.meta, "subtitle1") }}
                    </q-item-label></q-item-section
                  >
                </q-item>

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
            </q-item-section>
            <q-item-section top v-if="$q.screen.gt.xs">
              <q-list dense>
                <q-item dense v-if="siteItem.subtitle1">
                  <q-item-section avatar @click="openGoogleMaps">
                    <q-avatar
                      dense
                      rounded
                      color="primary"
                      icon="location_on"
                      text-color="white"
                      size="sm"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption"
                      >{{ translate(siteItem.subtitle1, siteItem.meta, "subtitle1") }}
                    </q-item-label></q-item-section
                  >
                </q-item>

                <q-separator spaced inset v-if="siteItem.contactPhone" />
                <q-item v-if="siteItem.contactPhone">
                  <q-item-section avatar @click="navigateToPhone">
                    <q-avatar
                      dense
                      rounded
                      color="primary"
                      icon="phone"
                      text-color="white"
                      size="sm"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-caption"
                      >{{ siteItem.contactPhone == undefined ? "N/A" : siteItem.contactPhone }}
                    </q-item-label></q-item-section
                  >
                </q-item>

                <q-separator spaced inset v-if="siteItem.contactWhatsApp" />

                <q-item v-if="siteItem.contactWhatsApp">
                  <q-item-section avatar @click="navigateToWhatsApp(siteItem.contactWhatsApp)">
                    <q-avatar
                      dense
                      rounded
                      color="primary"
                      icon="fab fa-whatsapp"
                      text-color="white"
                      size="sm"
                    />
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
            </q-item-section>
          </q-item>
        </q-tab-panel>

        <q-tab-panel name="checkIn" class="q-pa-none">
          <div v-if="geoPermissionStatus === GeolocationPermissionStatus.GRANTED">
            {{ "Site Location:  " + "Lat: " + item.latitude + " - " + " Lng: " + item.longitude }}
            <br />
            {{
              "Current User Location: " +
              "Lat: " +
              currentLatitude +
              " - " +
              " Lng: " +
              currentLongitude
            }}

            <br />
            {{ "Distance in meters: " + distanceToDestination + " m" }}
            <br />
            <q-btn @click="checkIn">CheckIn</q-btn>
          </div>
          <div v-else>Please turn localtion feature the settings</div>
        </q-tab-panel>
      </q-tab-panels>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import * as geolib from "geolib";
  import { useQuasar } from "quasar";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";
  import { useUserStore } from "@/stores/user";
  import { handlePermission, GeolocationPermissionStatus } from "@/composable/geo_permission";
  const { navigateToWhatsApp, translate, getImageURL } = useUtilities();
  const userStore = useUserStore();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    },
    galleryImages: {
      type: Array as PropType<GalleryImageType[]>,
      required: true
    }
  });

  const $q = useQuasar();

  const siteItem = computed(() => props?.item as SiteView);

  const geoPermissionStatus = ref(GeolocationPermissionStatus.DENIED);

  const { t } = useI18n({ useScope: "global" });

  const currentLatitude = ref(0);
  const currentLongitude = ref(0);
  const distanceToDestination = ref(0);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("aboutUs");
  const tabItems = ref([
    { name: "aboutUs", label: t("home.tabItems.aboutUs") },
    { name: "info", label: t("home.tabItems.info") },
    { name: "checkIn", label: "Checkin" }
  ]);

  onMounted(() => {
    // getLocation();
    checkGeoPermissionState();
  });

  const translatedContent: any = computed(() =>
    translate(siteItem.value.description, siteItem.value.meta, "description")
  );

  const mapImagePath = computed(() => {
    return siteItem.value.meta?.["hasMap"] === true
      ? getImageURL(props.item?.imagePath)
      : "./img/icons/no_image_available.jpeg";
  });

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
  const shouldShowImage = computed(() => siteItem.value.meta?.["hasMap"] === true);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(({ coords }) => {
        currentLatitude.value = coords.latitude;
        currentLongitude.value = coords.longitude;
        calculateDistance();
      });
    }
  }

  const calculateDistance = () => {
    const { latitude, longitude } = props.item;
    const sourceCoords = { latitude: currentLatitude.value, longitude: currentLongitude.value };
    const destinationCoords = { latitude, longitude };

    distanceToDestination.value = geolib.getDistance(sourceCoords, destinationCoords);
  };

  function checkIn() {
    if (!userStore.isUserLogon()) {
      showLoginDialog();
      return;
    }
    openCheckInDialog();
  }

  function openCheckInDialog() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/checkin-dialog.vue")),
      componentProps: {
        userLocation: {
          lat: currentLatitude.value,
          lng: currentLatitude.value
        },
        itemId: (props.item as SiteView).siteId
      }
    });
  }

  function showLoginDialog() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        callback: openCheckInDialog
      }
    });
  }

  async function checkGeoPermissionState() {
    try {
      const { status } = await handlePermission();
      geoPermissionStatus.value = status;
      switch (status) {
        case GeolocationPermissionStatus.GRANTED:
          getLocation();
          break;

        case GeolocationPermissionStatus.DENIED:
          console.log("Geolocation permission denied.");
          break;
        default:
          console.log("Unknown geolocation permission status.");
          break;
      }
    } catch (error) {
      console.error("Error occurred while requesting geolocation permission:", error);
    }
  }
</script>
