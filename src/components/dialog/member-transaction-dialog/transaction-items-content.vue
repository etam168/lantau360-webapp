<!-- member-items-content.vue -->
<template>
  <member-points @top-up-points="handleTopUpPoints" />

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
          <app-transaction-list-items
            :memberItems="filterGroupedArray(item.name)"
            :entityKey="entityKey"
            @on-member-detail="handleDetail"
          />
        </template>

        <template v-else>
          <div class="text-h6 text-center q-pa-md text-grey-6 text-weight-bold">
            {{ $t("errors.noRecord") }}
          </div>
        </template>
      </q-tab-panel>
    </q-tab-panels>
  </template>

  <app-transaction-list-items v-else :memberItems :entityKey @on-member-detail="handleDetail" />
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { Member } from "@/interfaces/models/entities/member";
  import type { TabItem } from "@/interfaces/tab-item";
  import type { Transaction } from "@/interfaces/models/entities/transaction";
  import { useUserStore } from "@/stores/user";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Props
  const { member, entityKey, points } = defineProps<{
    member: Member;
    entityKey: EntityURLKey;
    points?: Record<string, any>;
  }>();

  const { t } = useI18n({ useScope: "global" });
  const userStore = useUserStore();
  const { fetchData } = useApi();
  const { getEntityName } = useUtilities();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const entityName = getEntityName(entityKey);
  const i18nKeyMoreDialog = "more.mainMenuDialog";

  const memberItems = ref<CategoryTypes[]>([]);
  const historyItems = ref<Transaction[]>([]);
  const recentItems = ref<Transaction[]>([]);

  const $q = useQuasar();
  const entityData = ref<Record<string, any>>({});

  const groupBykey = computed<string | null>(() => {
    switch (entityKey) {
      case "ACCOUNT":
        return "account";
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
      case "account":
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
    if (entityKey === "ACCOUNT") {
      return [
        { name: "recent", label: t(`${i18nKeyMoreDialog}.${entityName}.recent`) },
        { name: "history", label: t(`${i18nKeyMoreDialog}.${entityName}.history`) }
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

  function handleTopUpPoints() {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/top-up-detail-dialog/index.vue")
      ),
      componentProps: { entityKey: entityKey }
    });
  }

  const addField = (transactions: any[], type: string) =>
    transactions.map(item => ({ ...item, transactionType: type }));

  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "ACCOUNT":
          // Fetch data from two different APIs concurrently
          const [history, recent, mem, memberPoints, memberConfig] = await Promise.all([
            fetchData(`${ENTITY_URL.MEMBER_TRANSACTIONS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_RECENT_TRANSACTIONS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_BY_ID}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_POINTS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_CONFIG}`)
          ]);

          historyItems.value = history;
          recentItems.value = recent;
          memberItems.value = [...recent, ...history];

          entityData.value.history = history;
          entityData.value.recent = recent;
          entityData.value.member = mem;

          const { total, spend, available, currentMonthTransactionCount } = memberPoints;
          userStore.setPointsInfo({ total, spend, available, currentMonthTransactionCount });

          userStore.setPoints(
            memberConfig.value?.meta.postPoint ?? 50,
            memberConfig.value?.meta.requestFreePoints ?? 100,
            memberConfig.value?.meta.purchsePrice ?? 100,
            memberConfig.value?.meta.purchsePoints ?? 100
          );

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
  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
