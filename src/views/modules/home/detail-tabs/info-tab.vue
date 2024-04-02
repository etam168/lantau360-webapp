<template>
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
              >{{ siteItem.contactWhatsApp == undefined ? "N/A" : siteItem.contactWhatsApp }}
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
            <q-avatar dense rounded color="primary" icon="phone" text-color="white" size="sm" />
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
              >{{ siteItem.contactWhatsApp == undefined ? "N/A" : siteItem.contactWhatsApp }}
            </q-item-label></q-item-section
          >
        </q-item>
      </q-list>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  const { navigateToWhatsApp, translate, getImageURL } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const siteItem = computed(() => props?.item as SiteView);

  const navigateToPhone = () => {
    if (siteItem.value.contactPhone) {
      const phoneURL = `tel:${siteItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  const mapImagePath = computed(() => {
    return siteItem.value.meta?.["hasMap"] === true
      ? getImageURL(props.item?.imagePath)
      : "./img/icons/no_image_available.jpeg";
  });

  const openGoogleMaps = () => {
    if (siteItem.value.meta?.["hasMap"]) {
      window.open(siteItem.value.meta?.["mapLink"], "_blank");
    } else {
      console.error("Map link not available");
    }
  };
  const shouldShowImage = computed(() => siteItem.value.meta?.["hasMap"] === true);
</script>
