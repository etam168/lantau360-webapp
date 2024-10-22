<template>
  <q-card class="bg-transparent" flat style="height: calc(100vh - 32px)">
    <component
      v-if="supportedEntityTypes.includes(entityKey)"
      :is="GenericEntityCreateForm<EntityType>"
      v-model:row="rowData"
      :entityKey="entityKey"
      :entityId="entityId"
      :entityOptions="entityOptions"
      @close-dialog="$emit('close-dialog', $event)"
      @after-entity-created="onAfterEntityCreated"
    />
    <div v-else>No matching entity type found.</div>
  </q-card>
</template>

<script setup lang="ts">
  // Type imports
  import type { EntityType } from "@/interfaces/types/entity-type";

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
  const { entityKey, entityId } = defineProps<{
    entityKey: EntityURLKey;
    entityId?: any;
  }>();

  const supportedEntityTypes = ["MEMBER", "POSTING", "CHECKIN"];

  // Composable function calls
  const { getEntityName, getImageUrlKey } = useUtilities();
  const { t } = useI18n({ useScope: "global" });

  const { fetchData } = useApi();
  const entityName = getEntityName(entityKey);
  const imageUrlKey = getImageUrlKey(entityKey);
  const userStore = useUserStore();

  // Property Listing Service Composable
  // const { fetchBusiness, fetchSiteOrBusiness } = useEntityOptionsFetcherService();
  // const { updateGalleryImages } = useEntityImageService<GalleryImageType>(imageUrlKey);

  // Reactive variables
  const splitterModel = ref(INPUT_PANE_WIDTH);

  const newEntityMap = {
    MEMBER: newMember
  };

  const rowData = ref(newEntityMap[entityKey as keyof typeof newEntityMap] || {});
  const initialization = ref();
  const entityOptions = ref<Record<string, any>>({});

  const fetchAllData = async () => {
    entityOptions.value = {};
    try {
      switch (entityKey) {
        case "MEMBER":
          entityOptions.value.galleryImages = [];
          const memberData = await fetchData(`${ENTITY_URL.MEMBER_BY_ID}/${userStore.userId}`);
          initialization.value = memberData;
          break;
        case "CHECKIN":
        case "POSTING":
          entityOptions.value.galleryImages = [];
          break;
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

  async function onAfterEntityCreated(payload: Record<string, any>) {}

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
