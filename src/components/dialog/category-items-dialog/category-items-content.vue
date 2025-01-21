<!-- category-items-content.vue -->
<template>
  <sightseeing-items
    v-if="directory.groupId === SIGHTSEEING_GROUP"
    :categoryItems
    :directory
    :entityKey
    :sortByKey
    @on-category-detail="onCategoryDetail"
  />

  <non-sightseeing-items
    v-else
    :categoryItems
    :directory
    :entityKey
    :sortByKey
    @on-category-detail="onCategoryDetail"
  />
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Import the new component
  import NonSightseeingItems from "./renderer/non-sightseeing-items.vue";
  import SightseeingItems from "./renderer/sightseeing-items.vue";

  // Props
  const {
    directory,
    entityKey,
    sortByKey = "default"
  } = defineProps<{
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    sortByKey?: string;
  }>();

  // Composable function calls
  const $q = useQuasar();
  const { locale } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();

  const { eventBus } = useUtilities(locale.value);
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const SIGHTSEEING_GROUP = 5 as const;

  // Reactive variables
  const categoryItems: Ref<CategoryTypes[]> = ref([]);

  const directoryId = computed<number>(() => {
    switch (entityKey) {
      case "BUSINESS":
        return (directory as BusinessDirectory).businessDirectoryId;
      case "SITE":
        return (directory as SiteDirectory).siteDirectoryId;
      default:
        return 0;
    }
  });

  async function onCategoryDetail(item: any) {
    openCategoryDetailDialog(item, entityKey, directory.displayMask);
  }

  /**
   * Fetches all required data concurrently
   * Populates the reactive variables with the fetched data
   */
  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "BUSINESS":
        case "SITE":
          categoryItems.value = await fetchData(
            `${ENTITY_URL[entityKey]}/ByDirectoryId/${directoryId.value}`
          );
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
