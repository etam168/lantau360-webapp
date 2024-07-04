<template>
  <gallery-section :item="item" />

  <q-list class="q-pa-md" style="background-color: #f6f6f6">
    <q-list class="rounded-borders">
      <!-- Description section -->
      <description-section
        :descriptionContent="translate(siteItem.description, siteItem.meta, 'description')"
        :item="item"
      />

      <!-- Location section -->
      <location-section
        :item="item"
        :can-check-in="true"
        @check-in="openCheckInDialog"
        :default-tooltip="translate(siteItem.siteName, siteItem.meta, 'siteName')"
        @open-map="openGoogleMaps"
      />

      <!-- Contact section -->
      <contact-section :item="item" />
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
  import GallerySection from "@/components/dialog/renderer/common/gallery-section.vue";
  import LocationSection from "@/components/dialog/renderer/common/location-section.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { notify, translate } = useUtilities();
  const siteItem = computed(() => props?.item as SiteView);

  const openCheckInDialog = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/check-in/index.vue")),
      componentProps: {
        item: props.item
      }
    });
  };

  const openGoogleMaps = () => {
    if (props.item.meta?.["hasMap"]) {
      window.open(props.item.meta?.["mapLink"], "_blank");
    } else {
      notify(t("errors.mapLinkNotAvailable"), "negative");
    }
  };
</script>
