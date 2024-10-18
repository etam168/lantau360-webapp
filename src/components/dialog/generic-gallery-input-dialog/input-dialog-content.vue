<template>
  <q-card class="bg-transparent" flat>
    <q-splitter
      v-model="splitterModel"
      unit="px"
      :limits="[INPUT_PANE_WIDTH, INPUT_PANE_WIDTH]"
      class="bg-transparent"
      style="height: calc(100vh - 32px)"
    >
      <!-- Create form slot -->
      <template v-slot:before>
        <component
          v-if="supportedEntityTypes.includes(entityKey)"
          :is="GenericEntityCreateForm<EntityType>"
          v-model:row="rowData"
          :entityKey="entityKey"
          :entityOptions="entityOptions"
          :initializationData
          @close-dialog="$emit('close-dialog', $event)"
          @after-entity-created="onAfterEntityCreated"
        />
        <div v-else>No matching entity type found.</div>
      </template>
      <template v-slot:after><preview-component :row="rowData" /> </template>
    </q-splitter>
  </q-card>
</template>

<script setup lang="ts">
  // Type imports
  import type { DatatableType } from "@/interfaces/types/datatable-types";
  import type { EntityType } from "@/interfaces/types/entity-type";
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

  // Component imports
  import GenericEntityCreateForm from "@/components/forms/generic-entity-create-form.vue";

  // Constant imports
  import { EntityURLKey, INPUT_PANE_WIDTH } from "@/constants";
  import { newAdvertisementDatatable } from "@/interfaces/datatable/advertisement-datatable";
  import { newAdvertisementImage } from "@/interfaces/models/entities/advertisement-image";
  import { newBusinessDatatable } from "@/interfaces/datatable/business-datatable";
  import { newBusinessImage } from "@/interfaces/models/entities/business-image";
  import { newBusinessPromotionDatatable } from "@/interfaces/datatable/business-promotion-datatable";
  import { newBusinessPromotionImage } from "@/interfaces/models/entities/business-promotion-image";
  import { newBusinessVoucherDatatable } from "@/interfaces/datatable/business-voucher-datatable";
  import { newBusinessVoucherImage } from "@/interfaces/models/entities/business-voucher-image";
  import { newCommunityEventDatatable } from "@/interfaces/datatable/community-events-datatable";
  import { newCommunityEventImage } from "@/interfaces/models/entities/community-event-image";
  import { newCommunityNewsDatatable } from "@/interfaces/datatable/community-news-datatable";
  import { newCommunityNewsImage } from "@/interfaces/models/entities/community-news-image";
  import { newCommunityNoticeDatatable } from "@/interfaces/datatable/community-notice-datatable";
  import { newCommunityNoticeImage } from "@/interfaces/models/entities/community-notice-image";
  import { newSiteDatatable } from "@/interfaces/datatable/site-datatable";
  import { newSiteImage } from "@/interfaces/models/entities/site-image";
  import { newStaffImage } from "@/interfaces/models/entities/staff-image";

  // Emits
  const emit = defineEmits(["close-dialog"]);

  // Props
  const { entityKey, previewComponent, initializationData } = defineProps<{
    entityKey: EntityURLKey;
    previewComponent?: Component;
    initializationData?: DatatableType;
  }>();

  import {roleOptions } from "@/constants";

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
  const { eventBus, getEntityId, getEntityName, getImageUrlKey, notify } = useUtilities();
  const { t } = useI18n({ useScope: "global" });

  const entityName = getEntityName(entityKey);
  const imageUrlKey = getImageUrlKey(entityKey);

  // Property Listing Service Composable
  const { fetchBusiness, fetchSiteOrBusiness } = useEntityOptionsFetcherService();
  const { updateGalleryImages } = useEntityImageService<GalleryImageType>(imageUrlKey);

  // Reactive variables
  const splitterModel = ref(INPUT_PANE_WIDTH);

  const newEntityMap = {
    ADVERTISEMENT: newAdvertisementDatatable,
    BUSINESS: newBusinessDatatable,
    BUSINESS_PROMOTION: newBusinessPromotionDatatable,
    BUSINESS_VOUCHER: newBusinessVoucherDatatable,
    COMMUNITY_EVENT: newCommunityEventDatatable,
    COMMUNITY_NEWS: newCommunityNewsDatatable,
    COMMUNITY_NOTICE: newCommunityNoticeDatatable,
    SITE: newSiteDatatable
  };

  const rowData = ref(newEntityMap[entityKey as keyof typeof newEntityMap] || {});
  const entityOptions = ref<Record<string, any>>({});

  const fetchAllData = async () => {
    entityOptions.value = {};
    try {
      switch (entityKey) {
        case "ADVERTISEMENT":
        case "BUSINESS_PROMOTION":
        case "BUSINESS_VOUCHER":
          entityOptions.value = await fetchBusiness(entityKey);
          break;
        case "COMMUNITY_EVENT":
        case "COMMUNITY_NEWS":
        case "COMMUNITY_NOTICE":
          entityOptions.value.galleryImages = [];
          break;
        case "SITE":
        case "BUSINESS":
          entityOptions.value = await fetchSiteOrBusiness(entityKey);
          break;
        case "STAFF":
          entityOptions.value.galleryImages = [];
          entityOptions.value.roleCode = roleOptions;
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

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

  async function onAfterEntityCreated(payload: Record<string, any>) {
    switch (entityKey) {
      case "ADVERTISEMENT":
      case "BUSINESS":
      case "BUSINESS_PROMOTION":
      case "BUSINESS_VOUCHER":
      case "COMMUNITY_EVENT":
      case "COMMUNITY_NEWS":
      case "COMMUNITY_NOTICE":
      case "SITE":
      case "STAFF":
        const entityId = getEntityId(payload.entityCreated as Record<string, any>, entityName);
        const newImage = newImageMap[entityKey as keyof typeof newImageMap];

        // Dynamically assign the entityId to the appropriate property of newImage
        const assignedEntityId = `${entityName}Id`;
        (newImage as any)[assignedEntityId] = entityId;

        await updateGalleryImages(payload.formData.galleryImages, newImage, entityId);
        break;
    }

    emit("close-dialog");
    notify(t(`${entityName}.message.createSuccess`), "positive");
    eventBus("LoadData").emit();
  }

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
