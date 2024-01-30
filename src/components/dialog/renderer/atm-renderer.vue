<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section top></q-item-section>
      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
          style="transform: translateY(-34px)"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section v-if="siteItem.imagePath">
        <q-img
          style="cursor: pointer"
          :ratio="16 / 9"
          width="100%"
          :src="siteItem.imagePath ? `${BLOB_URL}/${siteItem.imagePath}` : ''"
          @click="openGoogleMaps"
        >
        </q-img>
        <q-list dense v-if="$q.screen.xs">
          <q-item>
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

          <q-item v-if="siteItem.contactWhatsApp">
            <q-item-section avatar @click="navigateToWhatsApp(siteItem.contactWhatsApp)">
              <q-avatar>
                <q-icon name="fab fa-whatsapp" color="primary" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption"
                >{{ siteItem.contactWhatsApp == undefined ? "N/A" : siteItem.contactWhatsApp }}
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
        </q-list>
      </q-item-section>
      <q-item-section top v-if="$q.screen.gt.xs">
        <q-list dense>
          <q-item>
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

          <q-separator spaced inset v-if="siteItem.contactWhatsApp" />

          <q-item v-if="siteItem.contactWhatsApp">
            <q-item-section avatar @click="navigateToWhatsApp(siteItem.contactWhatsApp)">
              <!-- <q-avatar>
                <q-icon name="fab fa-whatsapp" color="primary" />
              </q-avatar> -->

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
                >{{ siteItem.contactWhatsApp == undefined ? "N/A" : siteItem.contactWhatsApp }}
              </q-item-label></q-item-section
            >
          </q-item>

          <q-separator spaced inset v-if="siteItem.contactPhone" />

          <q-item v-if="siteItem.contactPhone">
            <q-item-section avatar @click="navigateToPhone">
              <!-- <q-avatar>
                <q-icon name="phone" color="primary" />
              </q-avatar> -->

              <q-avatar dense rounded color="primary" icon="phone" text-color="white" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption"
                >{{ siteItem.contactPhone == undefined ? "N/A" : siteItem.contactPhone }}
              </q-item-label></q-item-section
            >
          </q-item>
        </q-list>
      </q-item-section>
    </q-item>

    <!-- <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item> -->
  </q-list>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts files
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";

  const { eventBus, navigateToWhatsApp, translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const siteItem = computed(() => props?.item as SiteView);

  // const translatedContent: any = computed(() =>
  //   translate(siteItem.value.description, siteItem.value.meta, "description")
  // );

  const favoriteItems = ref((LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[]);

  const isFavourite = computed(() => {
    const favItem = favoriteItems.value;
    return useArraySome(favItem, fav => fav.siteId == siteItem.value.siteId).value;
  });

  // const computeImagePath = computed(() => {
  //   return siteItem.value.imagePath
  //     ? `${BLOB_URL}/${siteItem.value.imagePath}`
  //     : "./img/icons/no_image_available.jpeg";
  // });

  const navigateToPhone = () => {
    if (siteItem.value.contactPhone) {
      const phoneURL = `tel:${siteItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  const onBtnFavClick = () => {
    const localFavItem = favoriteItems.value;
    if (isFavourite.value) {
      const itemIndex = localFavItem.findIndex(
        (item: any) => item.siteId === siteItem.value.siteId
      );

      if (itemIndex !== -1) {
        localFavItem.splice(itemIndex, 1);
        favoriteItems.value = localFavItem;
      }
    } else {
      localFavItem.push(siteItem.value);
      favoriteItems.value = localFavItem;
    }
    LocalStorage.set(STORAGE_KEYS.SAVED.SITE, favoriteItems.value);
    eventBus.emit("favoriteUpdated", props.item);
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
</script>
