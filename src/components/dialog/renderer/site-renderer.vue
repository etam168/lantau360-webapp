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
      </q-tab-panels>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  const { navigateToWhatsApp, translate, getImageURL } = useUtilities();

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

  const siteItem = computed(() => props?.item as SiteView);

  const { t } = useI18n({ useScope: "global" });

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("aboutUs");
  const tabItems = ref([
    { name: "aboutUs", label: t("home.tabItems.aboutUs") },
    { name: "info", label: t("home.tabItems.info") }
  ]);

  const translatedContent: any = computed(() =>
    translate(siteItem.value.description, siteItem.value.meta, "description")
  );

  const mapImagePath = computed(() => {
    const galleryValue = props.galleryImages;
    return siteItem.value.meta?.["hasMap"] === true && galleryValue && galleryValue.length > 1
      ? getImageURL(galleryValue[1]?.imagePath)
      : "./img/icons/no_image_available.jpeg";
  });

  const navigateToPhone = () => {
    if (siteItem.value.contactPhone) {
      const phoneURL = `tel:${siteItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  const openGoogleMaps = () => {
    // Check if the business has an address
    if (siteItem.value.subtitle1) {
      // Replace spaces in the address with '+'
      const address = encodeURIComponent(siteItem.value.subtitle1);

      // Construct the Google Maps URL with the address
      const mapsURL = `https://www.google.com/maps/search/?api=1&query=${address}`;

      // Open a new tab or window with the Google Maps URL
      window.open(mapsURL, "_blank");
    } else {
      // Handle cases where the business address is not available
      // console.error("Address not available");
    }
  };
  const shouldShowImage = computed(() => siteItem.value.meta?.["hasMap"] === true);
</script>
