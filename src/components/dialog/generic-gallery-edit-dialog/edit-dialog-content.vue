<template>
  <q-card class="bg-transparent row justify-center" flat style="height: calc(100vh - 51px)">
    <!-- Edit form slot -->

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
  </q-card>
</template>

<script setup lang="ts">
  // Type imports
  // import type { DatatableType } from "@/interfaces/types/datatable-types";
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
  import type { EntityType } from "@/interfaces/types/entity-type";
  // import { newSiteImage } from "@/interfaces/models/entities/comm";
  import { useUserStore } from "@/stores/user";

  // Component imports
  import GenericEntityEditForm from "@/components/forms/generic-entity-edit-form.vue";

  // Constant imports
  import { ENTITY_URL, EntityURLKey, ImageURLKey } from "@/constants";

  // Emits
  const emit = defineEmits(["close-dialog"]);

  // Props
  const { row, entityKey } = defineProps<{
    row: any;
    entityKey: EntityURLKey;
  }>();

  const imageUrlKey = `${entityKey}_IMAGE` as ImageURLKey;
  const supportedEntityTypes = ["POSTING"];

  // Composable function calls
  const { getEntityId, getEntityName } = useUtilities();

  const { updateGalleryImages } = useEntityImageService<GalleryImageType>(imageUrlKey);

  // Reactive variables
  const rowData = ref({ ...row });
  const initialization = ref();
  const { fetchData } = useApi();
  const entityOptions = ref<Record<string, any>>({});
  const entityName = getEntityName(entityKey);
  const entityId = getEntityId(rowData.value, entityName);
  const userStore = useUserStore();

  // const newImageMap = {
  //   POSTING: newSiteImage
  // };

  /**
   * Handles the update of an entity after the edit form is submitted.
   * @param formData - The data submitted from the edit form.
   */
  async function onAfterEntityUpdated(formData: any) {
    // const newImage = newImageMap[entityKey as keyof typeof newImageMap];
    // if (newImage) {
    //   const idKey = `${useChangeCase(entityKey, "camelCase").value}Id`;
    //   (newImage as any)[idKey] = entityId;
    //   await updateGalleryImages(formData.galleryImages, newImage, entityId);
    // } else {
    //   console.warn(`Unsupported entity type: ${entityKey}`);
    // }
    // emit("close-dialog");
    // notify(t(`${entityName}.message.updateSuccess`), "positive");
    // eventBus("LoadData").emit();
  }

  /**
   * Fetches all required data concurrently
   * Populates the reactive variables with the fetched data
   */
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

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
