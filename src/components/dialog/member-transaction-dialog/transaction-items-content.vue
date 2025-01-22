<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    row-key="title"
    :columns="columns"
    :rows="rows"
    v-model:pagination="pagination"
    :hide-pagination="hidePagination"
    :rows-per-page-options="[0]"
  >
    <template v-slot:top>
      <member-points @top-up-points="handleTopUpPoints" />
      <app-tab-select
        :tab-items="tabItems"
        :current-tab="tab"
        @update:currentTab="setTab"
        :class="$q.screen.lt.sm ? 'justify-center' : ''"
      />
    </template>

    <template v-slot:body-cell-title="props">
      <q-td :props="props">
        <q-item-label> {{ props.value }} </q-item-label>
        <q-item-label caption>{{ dateFormatter(props.row.createdAt) }} </q-item-label>
      </q-td>
    </template>

    <template v-slot:body-cell-points="props">
      <q-td :props="props">
        <q-item-label :class="props.row.transactionType === 2 ? 'text-red' : ''">
          {{ props.row.transactionType === 2 ? `${props.row.points}` : props.row.points }}
        </q-item-label>
      </q-td>
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
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { Member } from "@/interfaces/models/entities/member";
  import type { Transaction } from "@/interfaces/models/entities/transaction";

  import { useUserStore } from "@/stores/user";
  import { fasAngleLeft, fasAngleRight } from "@quasar/extras/fontawesome-v6";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";
  import { QTableColumn } from "quasar";
  import { useTransactionGrouping } from "@/composable/use-transaction-grouping";

  // Props
  const { member, entityKey } = defineProps<{
    member: Member;
    entityKey: EntityURLKey;
  }>();

  const transactionItems = ref<Transaction[]>([]);

  const userStore = useUserStore();
  const { fetchData } = useApi();
  const { getEntityName, dateFormatter } = useUtilities();

  const { tab, tabItems, rows, setTab } = useTransactionGrouping(transactionItems, entityKey);

  const hidePagination = computed(() => {
    return tab.value == "recent";
  });

  const $q = useQuasar();

  // Define an interface for the group object
  interface GroupedItems {
    group: string | number;
    items: CategoryTypes[];
  }

  function handleTopUpPoints() {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/top-up-detail-dialog/index.vue")
      ),
      componentProps: { entityKey: entityKey }
    });
  }

  // Define pagination
  const pagination = ref({
    sortBy: "description",
    descending: false,
    page: 1,
    rowsPerPage: hidePagination ? rows.value.length : 20
  });

  // Columns definition for the table
  const columns = computed(() => {
    return [
      {
        name: "title",
        label: "Description",
        required: true,
        align: "left",
        sortable: true,
        field: "title"
      },
      {
        name: "points",
        label: "Points",
        required: true,
        align: "right",
        field: "points"
      }
    ] as QTableColumn[];
  });

  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "ACCOUNT":
          // Fetch data from two different APIs concurrently
          const [history, mem, memberPoints, memberConfig] = await Promise.all([
            fetchData(`${ENTITY_URL.MEMBER_TRANSACTIONS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_BY_ID}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_POINTS}/${member.memberId}`),
            fetchData(`${ENTITY_URL.MEMBER_CONFIG}`)
          ]);

          transactionItems.value = history;

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
