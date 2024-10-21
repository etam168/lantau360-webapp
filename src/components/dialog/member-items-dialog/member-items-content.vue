<!-- member-items-content.vue -->
<template>
  <q-card>
    <member-points v-if="points" />

    <template v-if="groupBykey">
      <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

      <q-tab-panels v-model="tab">
        <q-tab-panel
          v-for="(item, index) in tabItems"
          :key="index"
          :name="item.name"
          class="q-pa-none"
        >
          <template v-if="filterGroupedArray(item.name).length > 0">
            <app-member-list-items
              :memberItems="filterGroupedArray(item.name)"
              :entityKey="entityKey"
              @on-member-detail="handleDetail"
            />
          </template>

          <template v-else>
            <div class="text-center q-pa-md">No data</div>
          </template>
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <app-member-list-items v-else :memberItems :entityKey @on-member-detail="handleDetail" />
  </q-card>
</template>

<script setup lang="ts">
  // Interface
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { Member } from "@/interfaces/models/entities/member";
  import type { TabItem } from "@/interfaces/tab-item";
  import type { Transaction } from "@/interfaces/models/entities/transaction";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Props
  const { member, entityKey, points } = defineProps<{
    member: Member;
    entityKey: EntityURLKey;
    points?: Record<string, any>;
  }>();

  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const memberItems = ref<CategoryTypes[]>([]);
  const historyItems = ref<Transaction[]>([]);
  const recentItems = ref<Transaction[]>([]);

  const entityData = ref<Record<string, any>>({});

  const groupBykey = computed<string | null>(() => {
    switch (entityKey) {
      case "TRANSACTION":
        return "transaction";
      // Add other cases here if needed
      default:
        return null;
    }
  });

  // Define an interface for the group object
  interface GroupedItems {
    group: string | number;
    items: CategoryTypes[];
  }

  const groupedArray = computed<GroupedItems[]>(() => {
    switch (groupBykey.value) {
      case "transaction":
        return [
          { group: "recent", items: recentItems.value },
          { group: "history", items: historyItems.value }
        ];

      default:
        return [];
    }
  });

  // New computed property for tabItems
  const tabItems = computed(() => {
    if (entityKey === "TRANSACTION") {
      return [
        { name: "recent", label: "Recent" },
        { name: "history", label: "History" }
      ];
    }

    return groupedArray.value.map(group => ({
      name: group.group,
      label: group.group
    })) as TabItem[];
  });

  const tab = ref("");
  const setTab = (val: string) => (tab.value = val);

  function filterGroupedArray(groupName: string) {
    const items = groupedArray.value.find(group => group.group === groupName)?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  async function handleDetail(item: any) {
    openCategoryDetailDialog(item);
  }

  const addField = (transactions: any[], type: string) =>
    transactions.map(item => ({ ...item, transactionType: type }));

  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "CHECKIN":
          memberItems.value = await fetchData(`${ENTITY_URL.CHECKIN_BY_MEMBER}/${member.memberId}`);
          break;

        case "TRANSACTION":
          // Fetch data from two different APIs concurrently
          const [history, recent, mem] = await Promise.all([
            fetchData(`${ENTITY_URL.MEMBER_TRANSACTIONS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_RECENT_TRANSACTIONS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_BY_ID}/${member.memberId}`)
          ]);

          historyItems.value = history;
          recentItems.value = recent;
          memberItems.value = [...recent, ...history];

          entityData.value.history = history;
          entityData.value.recent = recent;
          entityData.value.member = mem;
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }

      // Set the initial tab value after data is fetched
      if (memberItems.value.length > 0 && groupBykey.value) {
        tab.value = tabItems.value.length > 0 ? tabItems.value[0].name : "";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  // Fetch data as part of the setup
  await fetchAllData();
</script>
