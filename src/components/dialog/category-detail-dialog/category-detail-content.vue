<template>
  <template v-for="(item, index) in renderItems" :key="index" class="full-height">
    <carousel-image-list v-if="item.type === 'carousel'" :image-list="maskGalleryItems" />
    <contact-section v-else-if="item.type === 'contact' && showContactSection" :category />
    <expansion-contact-section
      v-else-if="item.type === 'expansion-contact' && showContactSection"
      :category
    />
    <expansion-description-section
      v-else-if="item.type === 'expansion-description'"
      :category
      :entityKey
    />
    <expansion-location-section
      v-else-if="item.type === 'expansion-location'"
      :category
      @open-map="openGoogleMaps(category)"
    />
    <description-section v-else-if="item.type === 'description'" :category />
    <favourite-section
      v-else-if="item.type === 'favourite'"
      :category
      :entityKey
      :has-check-in="entityKey.includes('SITE') && getSiteTemplate() !== 'Taxi'"
      @check-in="requestCheckIn(category)"
    />
    <open-close-time-section v-else-if="item.type === 'time'" :category :entityKey />
    <promotion-section v-else-if="item.type === 'promotion'" :category />
    <timetable-section v-else-if="item.type === 'timetable'" :category :entityKey />
  </template>
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
  const { requestCheckIn } = useCheckInDataService();
  const { openGoogleMaps } = useCategoryDialogService(entityKey);

  const maskGalleryItems = computed(() => {
    // Get the displayMask from props (default value)
    const defaultDisplayMask = displayMask;

    // Check if category has a displayMask (category's displayMask should override prop if non-zero)
    const categoryWithMask = category as { displayMask?: number };

    // Determine the effective displayMask:
    // - If category.displayMask is non-zero, use it
    // - If category.displayMask is 0 or undefined, use the prop displayMask
    const effectiveDisplayMask =
      categoryWithMask.displayMask !== undefined && categoryWithMask.displayMask !== 0
        ? categoryWithMask.displayMask
        : defaultDisplayMask;

    // If effectiveDisplayMask is less than 1, return all gallery items
    if (effectiveDisplayMask < 1) {
      return galleryItems.value;
    }

    // Filter gallery items based on the effective displayMask
    return galleryItems.value.filter((_, index) => {
      return !(effectiveDisplayMask & (1 << index)); // Hide item if the corresponding bit is 1
    });
  });

  const showContactSection = computed(() => {
    return !!(category.contactPhone || category.contactWhatsApp);
  });

  const CAROUSEL = { name: "carousel", type: "carousel" };
  const DESCRIPTION = { name: "description", type: "description" };
  const CONTACT = { name: "contact", type: "contact" };

  const renderItems = computed((): RenderItem[] => {
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
        // Construct baseItems conditionally
        const baseItems: RenderItem[] = hasCallOrTelephone
          ? [
              { name: "description", type: "description" },
              { name: "contact", type: "contact" }
            ]
          : [
              { name: "carousel", type: "carousel" },
              { name: "favourite", type: "favourite" }
            ];

        return baseItems;
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
    // we only need to process BusinessView data here
    switch (category.directoryTemplate) {
      case TEMPLATE.RESTAURANT.value:
        return RENDERER.RESTAURANT;
      default:
        return RENDERER.BUSINESS;
    }
  }

  function getSiteTemplate() {
    // we only need to process SiteView data here
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

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData(category);
</script>
