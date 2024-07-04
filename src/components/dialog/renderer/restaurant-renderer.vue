<template>
  <gallery-section :item="item" />

  <q-list class="q-px-md q-pb-md" style="background-color: #f6f6f6">
    <opening-hours-section :item="item" />

    <q-list class="rounded-borders">
      <description-section
        :descriptionContent="translate(businessItem.description, businessItem.meta, 'description')"
        :item="item"
      />

      <location-section
        :item="item"
        :default-tooltip="
          translate((props.item as BusinessView).businessName, props.item.meta, 'businessName')
        "
        @open-map="openGoogleMaps"
      />

      <!-- Contact section -->
      <contact-section :item="item" />
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // UI Components
  import ContactSection from "@/components/dialog/renderer/common/contact-section.vue";
  import DescriptionSection from "@/components/dialog/renderer/common/description-section.vue";
  import GallerySection from "@/components/dialog/renderer/common/gallery-section.vue";
  import LocationSection from "@/components/dialog/renderer/common/location-section.vue";
  import OpeningHoursSection from "@/components/dialog/renderer/common/opening-hours-section.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { t } = useI18n({ useScope: "global" });
  const { notify, translate } = useUtilities();

  const businessItem = computed(() => props?.item as BusinessView);

  const openGoogleMaps = () => {
    if (props.item.meta?.["hasMap"]) {
      window.open(props.item.meta?.["mapLink"], "_blank");
    } else {
      notify(t("errors.mapLinkNotAvailable"), "negative");
    }
  };
</script>
