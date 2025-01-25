<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    hide-pagination
    :rows="rows"
    :rowKey="rowKey"
    :rows-per-page-options="[0]"
  >
    <!-- Top Slot -->
    <template v-slot:top>
      <carousel-image-list v-if="hasCarousel" :image-list="maskGalleryItems" class="full-width" />
    </template>

    <!-- Body Slot -->
    <template v-slot:body="{ row }: { row: RowItem }">
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
          <favourite-section v-else-if="row.type === 'favourite'" :category :entityKey />
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
  import { EntityURLKey, TEMPLATE } from "@/constants";

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

  type RenderType =
    | "contact"
    | "expansion-contact"
    | "expansion-description"
    | "expansion-location"
    | "description"
    | "favourite"
    | "time"
    | "promotion"
    | "timetable";

  interface RowItem {
    id: string;
    type: RenderType;
  }

  const { galleryItems, fetchAllData } = useCategoryDialogService(entityKey);
  const { openGoogleMaps } = useCategoryDialogService(entityKey);

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
      return !(effectiveDisplayMask & (1 << index));
    });
  });

  const showContactSection = computed(() => {
    return !!(category.contactPhone || category.contactWhatsApp);
  });

  const rowKey = "id";

  const hasCarousel = computed(() => {
    switch (true) {
      case category.directoryTemplate === TEMPLATE.EMERGENCY.value:
      case category.directoryTemplate === TEMPLATE.DAYTRIP.value:
      case category.directoryTemplate === TEMPLATE.TIMETABLE.value:
        return false;
      default:
        return true;
    }
  });

  const types = computed((): RenderType[] => {
    switch (true) {
      case entityKey === "ADVERTISEMENT":
        return ["description", "contact"];
      case entityKey === "BUSINESS_PROMOTION":
        return ["promotion"];
      case category.directoryTemplate === TEMPLATE.DAYTRIP.value:
        return ["description"];
      case category.directoryTemplate === TEMPLATE.EMERGENCY.value:
        return ["description", "contact"];
      case category.directoryTemplate === TEMPLATE.TIMETABLE.value:
        return ["timetable"];
      case category.directoryTemplate === TEMPLATE.TAXI.value:
        return ["description", "contact"];
      case entityKey === "SITE":
        return ["favourite", "expansion-description", "expansion-location", "expansion-contact"];
      case entityKey === "BUSINESS":
        return ["time", "expansion-description", "expansion-location", "expansion-contact"];
      default:
        return [];
    }
  });

  const rows = computed((): RowItem[] => types.value.map(type => ({ id: type, type })));

  await fetchAllData(category);
</script>
