<!-- member-items-content.vue -->
<template>
  <member-points @top-up-points="handleTopUpPoints" />

  <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

  <q-tab-panels v-model="tab">
    <q-tab-panel v-for="(item, index) in tabItems" :key="index" :name="item.name" class="q-pa-none">
      <template v-if="filterGroupedArray(item.name).length > 0">
        <app-transaction-list-items
          :memberItems="filterGroupedArray(item.name)"
          :entityKey="entityKey"
          @on-member-detail="handleDetail"
          :hidePagination="isPaginationHide"
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

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { Member } from "@/interfaces/models/entities/member";
  import type { Transaction } from "@/interfaces/models/entities/transaction";
  import { useUserStore } from "@/stores/user";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Props
  const { member, entityKey } = defineProps<{
    member: Member;
    entityKey: EntityURLKey;
  }>();

  const { t } = useI18n({ useScope: "global" });
  const userStore = useUserStore();
  const { fetchData } = useApi();
  const { getEntityName } = useUtilities();
  // const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const entityName = getEntityName(entityKey);
  const i18nKeyMoreDialog = "more.mainMenuDialog";

  const isPaginationHide = ref(true);
  const historyItems = ref<Transaction[]>([]);
  const recentItems = ref<Transaction[]>([]);

  const $q = useQuasar();

  // Define an interface for the group object
  interface GroupedItems {
    group: string | number;
    items: CategoryTypes[];
  }

  const groupedArray = computed<GroupedItems[]>(() => {
    return [
      { group: "recent", items: recentItems.value },
      { group: "history", items: historyItems.value }
    ];
  });

  // New computed property for tabItems
  const tabItems = computed(() => {
    return [
      { name: "recent", label: t(`${i18nKeyMoreDialog}.${entityName}.recent`) },
      { name: "history", label: t(`${i18nKeyMoreDialog}.${entityName}.history`) }
    ];
  });

  const tab = ref("recent");
  const setTab = (val: string) => (tab.value = val);

  function filterGroupedArray(groupName: string) {
    isPaginationHide.value = groupName == "recent";
    const items = groupedArray.value.find(group => group.group === groupName)?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  async function handleDetail(item: any) {
    // openCategoryDetailDialog(item);
  }

  function handleTopUpPoints() {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/top-up-detail-dialog/index.vue")
      ),
      componentProps: { entityKey: entityKey }
    });
  }

  const fetchAllData = async () => {
    try {
      debugger;
      switch (entityKey) {
        case "ACCOUNT":
          // Fetch data from two different APIs concurrently
          const [history, mem, memberPoints, memberConfig] = await Promise.all([
            fetchData(`${ENTITY_URL.MEMBER_TRANSACTIONS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_BY_ID}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_POINTS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_CONFIG}`)
          ]);

          // Filter the history for the last 3 months for 'recent'
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

          recentItems.value = history.filter(
            (item: Transaction) => new Date(item.createdAt) >= threeMonthsAgo
          );

          historyItems.value = history;

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
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  await fetchAllData();
</script>
