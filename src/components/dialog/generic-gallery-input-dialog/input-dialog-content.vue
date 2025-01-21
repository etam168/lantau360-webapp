<template>
  <q-card class="bg-transparent row justify-center" flat style="height: calc(100vh - 51px)">
    <component
      v-if="supportedEntityTypes.includes(entityKey)"
      :is="GenericEntityCreateForm<EntityType>"
      v-model:row="rowData"
      :entityKey="entityKey"
      :associatedEntityId="associatedEntityId"
      :entityOptions="entityOptions"
      @close-dialog="$emit('close-dialog', $event)"
      @after-entity-created="onAfterEntityCreated"
    />
    <div v-else>No matching entity type found.</div>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
  import type { EntityType } from "@/interfaces/types/entity-type";

  import { newMember } from "@/interfaces/models/entities/member";
  import { newPostingImage } from "@/interfaces/models/entities/posting-image";

  // Component imports
  import GenericEntityCreateForm from "@/components/forms/generic-entity-create-form.vue";

  // Constant imports
  import { ENTITY_URL, EntityURLKey } from "@/constants";
  import { useUserStore } from "@/stores/user";

  // Composables
  import { EventBus } from "quasar";

  // Emits
  const emit = defineEmits(["close-dialog"]);

  // Props
  const { entityKey, associatedEntityId } = defineProps<{
    entityKey: EntityURLKey;
    associatedEntityId?: any;
  }>();

  const supportedEntityTypes = ["MEMBER", "POSTING", "CHECKIN"];

  // Composable function calls
  const { getEntityId, getEntityName, getImageUrlKey, notify } = useUtilities();
  const { t } = useI18n({ useScope: "global" });
  const bus = inject("bus") as EventBus;

  const { fetchData } = useApi();
  const entityName = getEntityName(entityKey);
  const imageUrlKey = getImageUrlKey(entityKey);
  const userStore = useUserStore();

  // Property Listing Service Composable
  const updateGalleryImages =
    entityKey !== "CHECKIN"
      ? useEntityImageService<GalleryImageType>(imageUrlKey)?.updateGalleryImages
      : null;

  // Reactive variables

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
          const memberData = await fetchData(`${ENTITY_URL.MEMBER_BY_ID}/${userStore.userInfo.userId}`);
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

  async function onAfterEntityCreated(payload: Record<string, any>) {
    const entityId = getEntityId(payload.entityCreated as any, entityName);

    switch (entityKey) {
      case "POSTING":
        newPostingImage.postingId = entityId;
        await updateGalleryImages(payload.formData.galleryImages, newPostingImage, entityId);
        break;
    }

    emit("close-dialog");
    notify(t(`${entityName}.message.createSuccess`), "positive");
    bus.emit("refreshData");
  }

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
