<template>
  <gallery-component :item="item" />

  <q-list padding class="q-pa-none q-py-md" style="background-color: #f6f6f6">
    <q-list class="rounded-borders q-mx-lg">
      <!-- Description section -->
      <description-section
        :descriptionContent="translate(siteItem.description, siteItem.meta, 'description')"
        :item="item"
      />

      <!-- Location section -->
      <location-content
        :item="item"
        :can-check-in="true"
        :default-tooltip="translate(siteItem.siteName, siteItem.meta, 'siteName')"
        @open-map="openGoogleMaps"
      />

      <!-- Contact section -->
      <contact-section :item="item" v-if="item.contactPhone || item.contactWhatsApp" />
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  // UI Components
  import ContactSection from "@/components/dialog/renderer/common/contact-section.vue";
  import DescriptionSection from "@/components/dialog/renderer/common/description-section.vue";
  import GalleryComponent from "@/components/dialog/renderer/common/gallery-component.vue";
  import LocationContent from "@/components/dialog/renderer/common/location-content.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { translate } = useUtilities();
  const siteItem = computed(() => props?.item as SiteView);

  const openGoogleMaps = () => {
    if (props.item.meta?.["hasMap"]) {
      window.open(props.item.meta?.["mapLink"], "_blank");
    } else {
      $q.notify(t("errors.mapLinkNotAvailable"));
    }
  };
</script>
