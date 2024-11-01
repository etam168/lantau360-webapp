<!-- member-items-content.vue -->
<template>
  <q-card>
    <app-member-list-items :memberItems :entityKey @on-member-detail="handleDetail" />
  </q-card>
</template>

<script setup lang="ts">
  // Interface
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { Member } from "@/interfaces/models/entities/member";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Props
  const { member, entityKey } = defineProps<{
    member: Member;
    entityKey: EntityURLKey;
    points?: Record<string, any>;
  }>();

  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const memberItems = ref<CategoryTypes[]>([]);

  async function handleDetail(item: any) {
    openCategoryDetailDialog(item,"CheckInItemDetailDialog");
  }

  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "CHECKIN":
          memberItems.value = await fetchData(`${ENTITY_URL.CHECKIN_BY_MEMBER}/${member.memberId}`);
          break;
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  // Fetch data as part of the setup
  await fetchAllData();
</script>
