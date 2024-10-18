<template>
  <q-card class="bg-transparent" flat style="height: calc(100vh - 32px)">
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
  </q-card>
</template>

<script setup lang="ts">
  // Type imports
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { EntityType } from "@/interfaces/types/entity-type";
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // Component imports
  import GenericEntityCreateForm from "@/components/forms/generic-entity-create-form.vue";

  // Constant imports
  import { ENTITY_URL, EntityURLKey, INPUT_PANE_WIDTH } from "@/constants";
  import { newMemberImage } from "@/interfaces/models/entities/member-image";
  import { newMember } from "@/interfaces/models/entities/member";

  import { useUserStore } from "@/stores/user";

  // Emits
  const emit = defineEmits(["close-dialog"]);

  // Props
  const { entityKey, previewComponent } = defineProps<{
    entityKey: EntityURLKey;
    previewComponent?: Component;
  }>();

  const supportedEntityTypes = ["MEMBER"];

  // Composable function calls
  const { eventBus, getEntityId, getEntityName, getImageUrlKey, notify } = useUtilities();
  const { t } = useI18n({ useScope: "global" });

  const { fetchData } = useApi();
  const entityName = getEntityName(entityKey);
  const imageUrlKey = getImageUrlKey(entityKey);
  const userStore = useUserStore();

  // Property Listing Service Composable
  // const { fetchBusiness, fetchSiteOrBusiness } = useEntityOptionsFetcherService();
  const { updateGalleryImages } = useEntityImageService<GalleryImageType>(imageUrlKey);

  // Reactive variables
  const splitterModel = ref(INPUT_PANE_WIDTH);

  const newEntityMap = {
    MEMBER: newMember
  };

  const rowData = ref(newEntityMap[entityKey as keyof typeof newEntityMap] || {});
  const initializationData = ref();
  const entityOptions = ref<Record<string, any>>({});

  const fetchAllData = async () => {
    entityOptions.value = {};
    try {
      switch (entityKey) {
        case "MEMBER":
          entityOptions.value.galleryImages = [];
          const memberData = await fetchData(`${ENTITY_URL.MEMBER_BY_ID}/${userStore.userId}`);
          initializationData.value = memberData;
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const newImageMap = {
    MEMBER: newMemberImage
  };

  async function onAfterEntityCreated(payload: Record<string, any>) {
    // switch (entityKey) {
    //   case "ADVERTISEMENT":
    //   case "BUSINESS":
    //   case "BUSINESS_PROMOTION":
    //   case "BUSINESS_VOUCHER":
    //   case "COMMUNITY_EVENT":
    //   case "COMMUNITY_NEWS":
    //   case "COMMUNITY_NOTICE":
    //   case "SITE":
    //   case "STAFF":
    //     const entityId = getEntityId(payload.entityCreated as Record<string, any>, entityName);
    //     const newImage = newImageMap[entityKey as keyof typeof newImageMap];
    //     // Dynamically assign the entityId to the appropriate property of newImage
    //     const assignedEntityId = `${entityName}Id`;
    //     (newImage as any)[assignedEntityId] = entityId;
    //     await updateGalleryImages(payload.formData.galleryImages, newImage, entityId);
    //     break;
    // }
    // emit("close-dialog");
    // notify(t(`${entityName}.message.createSuccess`), "positive");
    // eventBus("LoadData").emit();
  }

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
