<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    hide-pagination
    separator="cell"
    :rows="bodyRows"
    :row-key="rowKey"
    :rows-per-page-options="[0]"
  >
    <!-- Top Slot -->
    <template v-slot:top>
      <carousel-image-list v-if="carouselRow" :image-list="maskGalleryItems" class="full-width" />
    </template>

    <!-- Body Slot -->
    <template v-slot:body="{ row }">
      <q-tr>
        <q-td colspan="100%">
          <contact-section v-if="row.type === 'contact' && showContactSection" :category />
          <expansion-contact-section
            v-else-if="row.type === 'expansion-contact' && showContactSection"
            :category
          />
          <expansion-description-section
            v-else-if="row.type === 'expansion-description'"
            :category
            :entityKey
          />
          <expansion-location-section
            v-else-if="row.type === 'expansion-location'"
            :category
            @open-map="openGoogleMaps(category)"
          />
          <description-section v-else-if="row.type === 'description'" :category />
          <favourite-section
            v-else-if="row.type === 'favourite'"
            :category
            :entityKey
            :has-check-in="entityKey.includes('SITE') && getSiteTemplate() !== 'Taxi'"
          />
          <open-close-time-section v-else-if="row.type === 'time'" :category :entityKey />
          <promotion-section v-else-if="row.type === 'promotion'" :category />
          <timetable-section v-else-if="row.type === 'timetable'" :category :entityKey />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Constants
  import { EntityURLKey, TEMPLATE, RENDERER } from "@/constants";

  // Components
  import ContactSection from "./renderer/contact-section.vue";
  import DescriptionSection from "./renderer/description-section.vue";
  import ExpansionContactSection from "./renderer/expansion-contact-section.vue";
  import ExpansionDescriptionSection from "./renderer/expansion-description-section.vue";
  import ExpansionLocationSection from "./renderer/expansion-location-section.vue";
  import favouriteSection from "./renderer/favourite-section.vue";
  import OpenCloseTimeSection from "./renderer/open-close-time-section.vue";
  import PromotionSection from "./renderer/promotion-section.vue";
  import TimetableSection from "./renderer/timetable-section.vue";

  // Props
  const {
    category,
    entityKey,
    displayMask = 0
  } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    displayMask?: number;
  }>();

  interface RenderItem {
    name: string;
    itemCount?: number;
    type: string;
  }

  const { galleryItems, fetchAllData } = useCategoryDialogService(entityKey);
  const { openGoogleMaps } = useCategoryDialogService(entityKey);

  // Separate rows for top and body slots
  const carouselRow = computed(() => rows.value.find(row => row.type === "carousel"));
  const bodyRows = computed(() => rows.value.filter(row => row.type !== "carousel"));

  // Mask gallery items logic
  const maskGalleryItems = computed(() => {
    const defaultDisplayMask = displayMask;
    const categoryWithMask = category as { displayMask?: number };
    const effectiveDisplayMask =
      categoryWithMask.displayMask !== undefined && categoryWithMask.displayMask !== 0
        ? categoryWithMask.displayMask
        : defaultDisplayMask;

    if (effectiveDisplayMask < 1) {
      return galleryItems.value;
    }

    return galleryItems.value.filter((_, index) => {
      return !(effectiveDisplayMask & (1 << index)); // Hide item if the corresponding bit is 1
    });
  });

  // Check if contact section should be displayed
  const showContactSection = computed(() => {
    return !!(category.contactPhone || category.contactWhatsApp);
  });

  // Constants for Render Items
  const CAROUSEL = { name: "carousel", type: "carousel" };
  const DESCRIPTION = { name: "description", type: "description" };
  const CONTACT = { name: "contact", type: "contact" };

  // Rows and Template logic
  const rowKey = "name";
  const rows = computed((): RenderItem[] => {
    switch (template.value) {
      case RENDERER.ADVERTISEMENT:
        return [CAROUSEL, DESCRIPTION, CONTACT];
      case RENDERER.ATM:
      case RENDERER.SITE:
        return [
          { name: "carousel", type: "carousel" },
          { name: "favourite", type: "favourite" },
          { name: "expansion-description", type: "expansion-description" },
          { name: "expansion-location", type: "expansion-location" },
          { name: "expansion-contact", type: "expansion-contact" }
        ];
      case RENDERER.BUSINESS:
      case RENDERER.RESTAURANT:
        return [
          { name: "carousel", type: "carousel" },
          { name: "time", type: "time" },
          { name: "expansion-description", type: "expansion-description" },
          { name: "expansion-location", type: "expansion-location" },
          { name: "expansion-contact", type: "expansion-contact" }
        ];
      case RENDERER.DAYTRIP:
        return [CAROUSEL, DESCRIPTION];
      case RENDERER.EMERGENCY:
        return [DESCRIPTION, CONTACT];
      case RENDERER.PROMOTION:
        return [
          { name: "carousel", type: "carousel" },
          { name: "promotion", type: "promotion" }
        ];
      case RENDERER.TAXI: {
        const hasCallOrTelephone = ["title", "subtitle3"].some(
          key =>
            (category[key] || "").toLowerCase().includes("call") ||
            (category[key] || "").toLowerCase().includes("telephone")
        );

        return hasCallOrTelephone
          ? [
              { name: "description", type: "description" },
              { name: "contact", type: "contact" }
            ]
          : [
              { name: "carousel", type: "carousel" },
              { name: "favourite", type: "favourite" }
            ];
      }
      case RENDERER.TIMETABLE:
        return [{ name: "timetable", type: "timetable" }];
      default:
        return [];
    }
  });

  const template = computed(() => {
    switch (entityKey) {
      case "ADVERTISEMENT":
        return RENDERER.ADVERTISEMENT;
      case "BUSINESS":
        return getBusinessTemplate();
      case "BUSINESS_PROMOTION":
        return RENDERER.PROMOTION;
      case "BUSINESS_VOUCHER":
        return RENDERER.VOUCHER;
      case "SITE":
        return getSiteTemplate();
      default:
        return "";
    }
  });

  function getBusinessTemplate() {
    switch (category.directoryTemplate) {
      case TEMPLATE.RESTAURANT.value:
        return RENDERER.RESTAURANT;
      default:
        return RENDERER.BUSINESS;
    }
  }

  function getSiteTemplate() {
    switch (category.directoryTemplate) {
      case TEMPLATE.ATM.value:
        return RENDERER.ATM;
      case TEMPLATE.DAYTRIP.value:
        return RENDERER.DAYTRIP;
      case TEMPLATE.TIMETABLE.value:
        return RENDERER.TIMETABLE;
      case TEMPLATE.TAXI.value:
        return RENDERER.TAXI;
      case TEMPLATE.EMERGENCY.value:
        return RENDERER.EMERGENCY;
      default:
        return RENDERER.SITE;
    }
  }

  await fetchAllData(category);
</script>
