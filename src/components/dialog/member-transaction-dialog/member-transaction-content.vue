<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    row-key="title"
    :rows="rows"
    v-model:pagination="pagination"
    :hide-pagination="hidePagination"
    :rows-per-page-options="[0]"
  >
    <template v-slot:top>
      <member-points @top-up-points="handleTopUpPoints" style="width: 100%" />
      <app-tab-select
        :tab-items="tabItems"
        :current-tab="tab"
        @update:currentTab="setTab"
        :class="$q.screen.lt.sm ? 'justify-center' : ''"
      />
    </template>

    <template v-slot:body="{ row }">
      <q-tr :props="row">
        <q-td>
          <q-item-label>{{ row.title }}</q-item-label>
          <q-item-label caption>{{ dateFormatter(row.createdAt) }}</q-item-label>
        </q-td>
        <q-td>
          <q-item-label :class="row.transactionType === 2 ? 'text-red' : ''">
            {{ row.transactionType === 2 ? `-${row.points}` : row.points }}
          </q-item-label>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:pagination="scope">
      <app-button
        :icon="fasAngleLeft"
        size="sm"
        color="grey-8"
        round
        dense
        flat
        :disable="scope.isFirstPage"
        @click="scope.prevPage"
      />
      <q-btn
        :icon="fasAngleRight"
        size="sm"
        color="grey-8"
        round
        dense
        flat
        :disable="scope.isLastPage"
        @click="scope.nextPage"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Interfaces
  import type { Member } from "@/interfaces/models/entities/member";
  import type { Transaction } from "@/interfaces/models/entities/transaction";

  // Imports
  import { useUserStore } from "@/stores/user";
  import { useMemberPointsStore } from "@/stores/member-points-store";

  import { fasAngleLeft, fasAngleRight } from "@quasar/extras/fontawesome-v6";
  import { useTransactionGrouping } from "@/composable/use-transaction-grouping";
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Props
  const { member, entityKey } = defineProps<{
    member: Member;
    entityKey: EntityURLKey;
  }>();

  // Reactive Variables
  const transactionItems = ref<Transaction[]>([]);
  const pagination = ref({
    sortBy: "description",
    descending: false,
    page: 1,
    rowsPerPage: 20
  });

  // Composables and Utilities
  const userStore = useUserStore();
  const memberPointStore = useMemberPointsStore();
  const { fetchData } = useApi();
  const { dateFormatter } = useUtilities();
  const { tab, tabItems, rows, setTab } = useTransactionGrouping(transactionItems, entityKey);
  const { openTopUpPointsDialog } = useMemberItemDialogService();

  const $q = useQuasar();
  const isDialogOpen = ref(false);

  // Computed Properties
  const hidePagination = computed(() => tab.value === "recent");

  // Methods
  function handleTopUpPoints() {
    openTopUpPointsDialog(isDialogOpen,entityKey)
  }

  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "ACCOUNT": {
          const [history, mem, memberPoints, memberConfig] = await Promise.all([
            fetchData(`${ENTITY_URL.MEMBER_TRANSACTIONS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_BY_ID}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_POINTS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_CONFIG}`)
          ]);

          transactionItems.value = history;

          const { total, spend, available, currentMonthTransactionCount } = memberPoints;
          memberPointStore.setPointsInfo({ total, spend, available, currentMonthTransactionCount });

          memberPointStore.setPoints(
            memberConfig.meta?.postPoint ?? 50,
            memberConfig.meta?.requestFreePoints ?? 100,
            memberConfig.meta?.purchsePrice ?? 100,
            memberConfig.meta?.purchsePoints ?? 100
          );
          break;
        }
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  // Fetch Data
  await fetchAllData();
</script>
