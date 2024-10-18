<template>
  <q-card class="bg-transparent" flat>
    <q-splitter
      v-model="splitterModel"
      unit="px"
      :limits="[INPUT_PANE_WIDTH, INPUT_PANE_WIDTH]"
      class="bg-transparent"
      style="height: calc(100vh - 32px)"
    >
      <!-- Edit form slot -->
      <template v-slot:before>
        <component
          v-if="supportedEntityTypes.includes(entityKey)"
          :is="GenericEntityEditForm<EntityType>"
          v-model:row="rowData"
          :entityKey="entityKey"
          :entityOptions="entityOptions"
          @close-dialog="$emit('close-dialog', $event)"
          @after-entity-updated="onAfterEntityUpdated"
        />
        <div v-else>No matching entity type found.</div>
      </template>
      <template v-slot:after><app-description-input :row="rowData" /></template>
    </q-splitter>
  </q-card>
</template>

<script setup lang="ts">
  // Type imports
  import type { DatatableType } from "@/interfaces/types/datatable-types";
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
  import type { EntityType } from "@/interfaces/types/entity-type";

  // Component imports
  import GenericEntityEditForm from "@/components/forms/generic-entity-edit-form.vue";

  // Composables imports
  import { useChangeCase } from "@vueuse/integrations/useChangeCase";

  // Constant imports
  import { EntityURLKey, ImageURLKey, INPUT_PANE_WIDTH } from "@/constants";
  import { newAdvertisementImage } from "@/interfaces/models/entities/advertisement-image";
  import { newBusinessImage } from "@/interfaces/models/entities/business-image";
  import { newBusinessPromotionImage } from "@/interfaces/models/entities/business-promotion-image";
  import { newBusinessVoucherImage } from "@/interfaces/models/entities/business-voucher-image";
  import { newCommunityEventImage } from "@/interfaces/models/entities/community-event-image";
  import { newCommunityNewsImage } from "@/interfaces/models/entities/community-news-image";
  import { newCommunityNoticeImage } from "@/interfaces/models/entities/community-notice-image";
  import { newSiteImage } from "@/interfaces/models/entities/site-image";

  // Emits
  const emit = defineEmits(["close-dialog"]);

  // Props
  const { row, entityKey } = defineProps<{
    row: DatatableType;
    entityKey: EntityURLKey;
  }>();

  import {roleOptions } from "@/constants";
import { newStaffImage } from "@/interfaces/models/entities/staff-image";

  //const entityName = useChangeCase(entityKey, "camelCase").value;
  // const entityId = (row as any)[`${entityName}Id`];
  const imageUrlKey = `${entityKey}_IMAGE` as ImageURLKey;

  const supportedEntityTypes = [
    "ADVERTISEMENT",
    "BUSINESS",
    "BUSINESS_PROMOTION",
    "BUSINESS_VOUCHER",
    "COMMUNITY_EVENT",
    "COMMUNITY_NEWS",
    "COMMUNITY_NOTICE",
    "SITE",
    "STAFF"
  ];

  // Composable function calls
  const { eventBus, getEntityId, getEntityName, notify } = useUtilities();
  const { t } = useI18n({ useScope: "global" });

  const { fetchBusiness, fetchSiteOrBusiness, fetchGalleryImages } =
    useEntityOptionsFetcherService();
  const { updateGalleryImages } = useEntityImageService<GalleryImageType>(imageUrlKey);

  // Reactive variables
  const splitterModel = ref(INPUT_PANE_WIDTH);
  const rowData = ref({ ...row });
  const entityOptions = ref<Record<string, any>>({});
  const entityName = getEntityName(entityKey);
  const entityId = getEntityId(rowData.value, entityName);

  const newImageMap = {
    ADVERTISEMENT: newAdvertisementImage,
    BUSINESS: newBusinessImage,
    BUSINESS_PROMOTION: newBusinessPromotionImage,
    BUSINESS_VOUCHER: newBusinessVoucherImage,
    COMMUNITY_EVENT: newCommunityEventImage,
    COMMUNITY_NEWS: newCommunityNewsImage,
    COMMUNITY_NOTICE: newCommunityNoticeImage,
    SITE: newSiteImage,
    STAFF: newStaffImage
  };

  /**
   * Handles the update of an entity after the edit form is submitted.
   * @param formData - The data submitted from the edit form.
   */
  async function onAfterEntityUpdated(formData: any) {
    const newImage = newImageMap[entityKey as keyof typeof newImageMap];
    if (newImage) {
      const idKey = `${useChangeCase(entityKey, "camelCase").value}Id`;
      (newImage as any)[idKey] = entityId;
      await updateGalleryImages(formData.galleryImages, newImage, entityId);
    } else {
      console.warn(`Unsupported entity type: ${entityKey}`);
    }

    emit("close-dialog");
    notify(t(`${entityName}.message.updateSuccess`), "positive");
    eventBus("LoadData").emit();
  }

  /**
   * Fetches all required data concurrently
   * Populates the reactive variables with the fetched data
   */
  const fetchAllData = async () => {
    entityOptions.value = {};
    try {
      switch (entityKey) {
        case "ADVERTISEMENT":
        case "BUSINESS_PROMOTION":
        case "BUSINESS_VOUCHER":
          entityOptions.value = await fetchBusiness(entityKey, "update", entityId);
        case "COMMUNITY_EVENT":
        case "COMMUNITY_NEWS":
        case "COMMUNITY_NOTICE":
          entityOptions.value.galleryImages = await fetchGalleryImages(entityKey, entityId);
          break;
        case "BUSINESS":
        case "SITE":
          entityOptions.value = await fetchSiteOrBusiness(entityKey, "update", entityId);
          break;
        case "STAFF":
          entityOptions.value.galleryImages =  await fetchGalleryImages(entityKey, entityId);
          entityOptions.value.roleCode = roleOptions;
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
