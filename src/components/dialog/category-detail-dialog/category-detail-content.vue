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
  import { ENTITY_URL, EntityURLKey, TEMPLATE } from "@/constants";

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
  import { GalleryImageType } from "@/interfaces/types/gallery-image-type";

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

  const { getEntityId, getEntityName } = useUtilities();
  const { fetchData } = useApi();

  const { galleryItems } = useCategoryDialogService(entityKey);
  const { openGoogleMaps } = useCategoryDialogService(entityKey);

  const showContactSection = computed(() => {
    return !!(category.contactPhone || category.contactWhatsApp);
  });

  const rowKey = "id";

  const hasCarousel = computed(() => {
    // Handle other directory templates
    switch (true) {
      case category.directoryTemplate === TEMPLATE.EMERGENCY.value:
      case category.directoryTemplate === TEMPLATE.TIMETABLE.value:
        return false;
      case category.directoryTemplate === TEMPLATE.TAXI.value && category.subtitle3 == "Call Taxi":
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
      case category.directoryTemplate === TEMPLATE.TAXI.value && category.subtitle3 == "Call Taxi":
        return ["description", "contact"];
      case category.directoryTemplate === TEMPLATE.TAXI.value:
        return ["favourite"];
      case entityKey === "SITE":
        return ["favourite", "expansion-description", "expansion-location", "expansion-contact"];
      case entityKey === "BUSINESS":
        return ["time", "expansion-description", "expansion-location", "expansion-contact"];
      default:
        return [];
    }
  });

  const rows = computed((): RowItem[] => types.value.map(type => ({ id: type, type })));

  async function fetchAllData() {
    try {
      switch (entityKey) {
        case "SITE":
        case "ADVERTISEMENT":
        case "BUSINESS":
        case "BUSINESS_PROMOTION":
          const entityName = getEntityName(entityKey);
          const id = getEntityId(category, entityName);
          const baseUrl = ENTITY_URL[`${entityKey}_GALLERY`];
          const finalUrl = `${baseUrl}/${id}`;
          const response = await fetchData<GalleryImageType[]>(finalUrl);
          galleryItems.value = response;
          break;
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  await fetchAllData();
</script>
