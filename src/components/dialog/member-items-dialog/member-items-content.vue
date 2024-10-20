<!-- category-items-content.vue -->
<template>
  <q-card>
    <template v-if="groupBykey">
      <q-card class="q-ma-md q-py-md text-white bg-primary">
        <q-card-section class="row items-center justify-between">
          <!-- Points Balance Section -->
          <div>
            <div class="text-subtitle1">
              {{
                $t("more.profileSetting.availablePoints", {
                  availablePoints: 50
                })
              }}
            </div>
            <div class="text-caption">
              {{
                $t("more.profileSetting.bythisTimeText", {
                  spentPoints: 50
                })
              }}
            </div>
          </div>
          <!-- Top-up Points Button -->
          <q-btn dense rounded class="text-primary bg-grey-1 text-caption q-px-md">{{
            $t("more.profileSetting.buyPoints")
          }}</q-btn>
        </q-card-section>
      </q-card>

      <app-tab-select
        :tab-items="tabItems"
        :current-tab="tab"
        @update:currentTab="setTab"
        :style="$q.screen.lt.sm ? 'flex-wrap: wrap' : ''"
        :class="$q.screen.lt.sm ? 'q-pt-sm' : ''"
      />

      <q-tab-panels v-model="tab">
        <q-tab-panel
          v-for="(item, index) in tabItems"
          :key="index"
          :name="item.name"
          class="q-pa-none"
        >
          <app-category-list-items
            :categoryItems="filterGroupedArray(item.name)"
            :checkIns="checkIns"
            :entityKey="entityKey"
            @on-category-detail="handleDetail"
          />
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <app-category-list-items
      v-else
      :categoryItems="categoryItems"
      :checkIns="checkIns"
      :entityKey="entityKey"
      @on-category-detail="handleDetail"
    />
  </q-card>
</template>

<script setup lang="ts">
  // Interface
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { Directory } from "@/interfaces/models/entities/directory";
  import type { TabItem } from "@/interfaces/tab-item";
  import type { MemberTypes } from "@/interfaces/types/member-types";

  // Constants
  import { AREA_NAME, ENTITY_URL, EntityURLKey, NONE, URL } from "@/constants";

  // Composables
  import { useQuasar } from "quasar";

  // Props
  const props = defineProps<{
    member: MemberTypes;
    entityKey: EntityURLKey;
  }>();

  const { groupBy, translate } = useUtilities();
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(props.entityKey);
  const $q = useQuasar();

  const categoryItems = ref<CategoryTypes[]>([]);
  const checkIns = ref<CheckIn[]>([]);

  const groupBykey = computed<string | null>(() => {
    switch (props.entityKey) {
      case "ACCOUNT":
        return "transactionType";
      // Add other cases here if needed
      default:
        return null;
    }
  });

  const groupedArray = computed(() => {
    if (groupBykey.value == null) {
      return [];
    }

    const key = groupBykey.value;
    const getTranslatedKey = (item: CategoryTypes): string | number => {
      if (!(key in item)) {
        return "Invalid!"; // Or any default value you prefer
      }

      const itemValue = item[key as keyof CategoryTypes] as string;
      const metaData = key === AREA_NAME ? (item as any).areaNameAlt : item.meta;
      return translate(itemValue, metaData, key);
    };

    const validItems = categoryItems.value.filter(
      (item: CategoryTypes) => key in item && item[key as keyof CategoryTypes] !== undefined
    );

    return groupBy(validItems, getTranslatedKey);
  });

  //   // Define tabItems as a computed property
  //   const tabItems = computed(() => {
  //   return groupedArray.value.map(group => ({
  //     name: group.group,
  //     label: group.group
  //   })) as TabItem[];
  // });

  // New computed property for tabItems
  const tabItems = computed(() => {
    if (props.entityKey === "ACCOUNT") {
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

  // function filterGroupedArray(groupName: string) {
  //   const items = groupedArray.value.find(group => group.group === groupName)?.items || [];
  //   return items.sort((a: any, b: any) => a.rank - b.rank);
  // }

  function filterGroupedArray(groupName: string) {
    if (props.entityKey === "ACCOUNT") {
      return categoryItems.value.filter(item => item.transactionType === groupName);
    }
    const items = groupedArray.value.find(group => group.group === groupName)?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  async function handleDetail(item: any) {
    openCategoryDetailDialog(item);
  }

  const fetchAllData = async () => {
    try {
      switch (props.entityKey) {
        case "CHECKIN":
          categoryItems.value = await fetchData(
            `${URL.CHECKIN_BY_MEMBER}/${props.member.memberId}`
          );
          break;
        case "ACCOUNT":
          // Fetch data from two different APIs concurrently
          const [transactions, recentTransactions] = await Promise.all([
            fetchData(`${URL.MEMBER_TRANSACTIONS_URL}/${props.member.memberId}`),
            fetchData(`${URL.MEMBER_RECENT_RANSACTIONS_URL}/${props.member.memberId}`)
          ]);

          // Add a transactionType property to each item
          const historyTransactions = transactions.map((item: any) => ({
            ...item,
            transactionType: "history"
          }));
          const recentTransactionsWithType = recentTransactions.map((item: any) => ({
            ...item,
            transactionType: "recent"
          }));

          // Combine the results into categoryItems
          categoryItems.value = [...recentTransactionsWithType, ...historyTransactions];
          break;
        default:
          console.warn(`Unsupported entity type: ${props.entityKey}`);
      }

      // Set the initial tab value after data is fetched
      if (categoryItems.value.length > 0 && groupBykey.value) {
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
