<template>
  <q-list dense>
    <q-item dense v-if="businessItem.subtitle1">
      <q-item-section avatar @click="openGoogleMaps">
        <q-avatar dense rounded color="primary" icon="location_on" text-color="white" size="sm" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-caption"
          >{{ translate(businessItem.subtitle1, businessItem.meta, "subtitle1") }}
        </q-item-label></q-item-section
      >
    </q-item>
    <q-separator spaced inset v-if="businessItem.contactPhone" />
    <q-item v-if="businessItem.contactPhone">
      <q-item-section avatar @click="navigateToPhone">
        <q-avatar dense rounded color="primary" icon="phone" text-color="white" size="sm" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-caption"
          >{{ businessItem.contactPhone == undefined ? "N/A" : businessItem.contactPhone }}
        </q-item-label></q-item-section
      >
    </q-item>
    <q-separator spaced inset v-if="businessItem.contactWhatsApp" />
    <q-item v-if="businessItem.contactWhatsApp">
      <q-item-section avatar @click="navigateToWhatsApp(businessItem.contactWhatsApp)">
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
          >{{ businessItem.contactWhatsApp == undefined ? "N/A" : businessItem.contactWhatsApp }}
        </q-item-label></q-item-section
      >
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

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
    }
  });

  const { t } = useI18n({ useScope: "global" });

  const businessItem = computed(() => props?.item as BusinessView);

  const navigateToPhone = () => {
    if (businessItem.value.contactPhone) {
      const phoneURL = `tel:${businessItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  const openGoogleMaps = () => {
    // Check if the business has a map link
    if (businessItem.value.meta?.["hasMap"]) {
      // Open a new tab or window with the provided map link
      window.open(businessItem.value.meta?.["mapLink"], "_blank");
    } else {
      // Handle cases where the map link is not available
      console.error(t("errors.mapLinkNotAvailable"));
    }
  };
</script>
