<template>
  <q-card class="bg-transparent row justify-center" flat style="height: calc(100vh - 51px)">
    <component
      v-if="supportedEntityTypes.includes(entityKey)"
      :is="CheckInEntityCreateForm<EntityType>"
      :entityKey="entityKey"
      :site="site"
      @close-dialog="$emit('close-dialog', $event)"
    />
    <div v-else>No matching entity type found.</div>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import type { EntityType } from "@/interfaces/types/entity-type";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Component imports
  import CheckInEntityCreateForm from "@/components/forms/checkin-entity-create-form.vue";

  // Constants
  import { EntityURLKey } from "@/constants";

  const emit = defineEmits(["close-dialog"]);

  const { entityKey, site } = defineProps<{
    entityKey: EntityURLKey;
    site?: SiteView;
  }>();

  const supportedEntityTypes = ["CHECKIN"];
  const entityOptions = ref<Record<string, any>>({});

  const fetchAllData = async () => {
    entityOptions.value = {};
    try {
      switch (entityKey) {
        case "CHECKIN":
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

  await fetchAllData();
</script>
