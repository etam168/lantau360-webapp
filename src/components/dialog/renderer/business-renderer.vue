<template>
  <gallery-component :item="item" />

  <q-list padding class="q-pa-none q-pb-md" style="background-color: #f6f6f6">
    <open-close-time-content :item="item" />

    <q-list class="rounded-borders q-mx-lg">
      <!-- Description expansion -->
      <description-section
        :descriptionContent="translate(businessItem.description, businessItem.meta, 'description')"
        :item="item"
      />

      <location-content
        :item="item"
        :default-tooltip="translate(businessItem.businessName, businessItem.meta, 'businessName')"
        @open-map="openGoogleMaps"
      />

      <!-- Contact expansion -->
      <q-card v-if="item.contactPhone || item.contactWhatsApp">
        <q-card-section class="q-pa-sm">
          <q-expansion-item
            :label="'Contact Info'"
            group="siteGroup"
            dense
            dense-toggle
            header-class="text-h6"
          >
            <q-separator />
            <q-card>
              <q-card-section
                class="q-pa-none"
                :class="{ 'row no-wrap': $q.screen.gt.xs, column: !$q.screen.gt.xs }"
              >
                <contact-content :item="item" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // UI Components
  import ContactContent from "@/components/dialog/renderer/common/contact-content.vue";
  import GalleryComponent from "@/components/dialog/renderer/common/gallery-component.vue";
  import LocationContent from "@/components/dialog/renderer/common/location-content.vue";
  import DescriptionSection from "@/components/dialog/renderer/common/description-section.vue";
  import OpenCloseTimeContent from "@/components/dialog/renderer/common/open-close-time-content.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });
  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { translate } = useUtilities();
  const businessItem = computed(() => props?.item as BusinessView);

  const openGoogleMaps = () => {
    if (props.item.meta?.["hasMap"]) {
      window.open(props.item.meta?.["mapLink"], "_blank");
    } else {
      $q.notify(t("errors.mapLinkNotAvailable"));
    }
  };
</script>
