<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    hide-pagination
    separator="none"
    :rows="rows"
    :rowKey="rowKey"
    :rows-per-page-options="[0]"
  >
    <!-- Top Slot -->
    <template v-slot:top>
      <carousel-image-list
        v-if="hasCarousel"
        :gallery-items="galleryItems"
        :display-mask="displayMask"
        :category="category"
        class="full-width"
      />
    </template>

    <!-- Body Slot -->
    <template v-slot:body="{ row }: { row: RowItem }">
      <q-tr>
        <q-td colspan="100%" style="word-break: break-word; white-space: normal">
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

  const showContactSection = computed(() => {
    return !!(category.contactPhone || category.contactWhatsApp);
  });

  const rowKey = "id";

  const hasCarousel = computed(() => {
    const hasCallOrTelephone = ["title", "subtitle3"].some(
      key =>
        ((category as any)[key] || "").toLowerCase().includes("call") ||
        ((category as any)[key] || "").toLowerCase().includes("telephone")
    );

    // Explicitly handle the TAXI renderer case
    if (category.directoryTemplate === TEMPLATE.TAXI.value) {
      return !hasCallOrTelephone; // Do not show the carousel if hasCallOrTelephone is true
    }

    // Handle other directory templates
    switch (true) {
      case category.directoryTemplate === TEMPLATE.EMERGENCY.value:
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
      case category.directoryTemplate === TEMPLATE.TAXI.value: {
        const hasCallOrTelephone = ["title", "subtitle3"].some(
          key =>
            ((category as any)[key] || "").toLowerCase().includes("call") ||
            ((category as any)[key] || "").toLowerCase().includes("telephone")
        );

        return hasCallOrTelephone ? ["description", "contact"] : ["favourite"];
      }

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
