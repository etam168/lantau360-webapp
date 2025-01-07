<template>
  <q-table
    ref="qTableRef"
    v-bind="$attrs"
    :card-style="cardStyle"
    class="sticky-header-column"
    :rows="transactionItem"
    :columns="columns"
    flat
    row-key="description"
    v-model:pagination="pagination"
    :hide-pagination="hidePagination"
    :dense="$q.screen.lt.md"
  >
    <template v-slot:body-cell-description="props">
      <q-td :props="props">
        {{ props.value }}
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
  import { QTable, QTableColumn } from "quasar";
  import type { TransactionView } from "@/interfaces/models/views/trasaction-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import { EntityURLKey } from "@/constants";

  import { fasAngleLeft, fasAngleRight } from "@quasar/extras/fontawesome-v6";

  const emits = defineEmits(["on-member-detail"]);

  // Props
  const { memberItems, entityKey, hidePagination } = defineProps<{
    memberItems: CategoryTypes[];
    entityKey: EntityURLKey;
    hidePagination?: boolean;
  }>();

  const transactionItem = ref<TransactionView[]>(memberItems as TransactionView[]);
  const $q = useQuasar();

  const MEMBER_POINTS_HEIGHT = 76 as const;
  const OTHER_HEIGHT = 96 + 72;

  const usedHeight = computed(() => {
    return MEMBER_POINTS_HEIGHT + OTHER_HEIGHT;
  });

  const cardStyle = computed(() => {
    return $q.screen.height > 600 ? { height: `calc(100vh - ${usedHeight.value}px)` } : "";
  });

  // Define pagination
  const pagination = ref({
    sortBy: "description",
    descending: false,
    page: 1,
    rowsPerPage: hidePagination ? transactionItem.value.length : 20
  });

  // Columns definition for the table
  const columns = computed(() => {
    return [
      {
        name: "description",
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
</script>
<style>
  .q-pagination .q-icon {
    color: #000; /* Use a contrasting color */
  }
  .q-table th i.q-icon.fas.fa-arrow-up.q-table__sort-icon:before {
    content: "▲";
  }

  i.q-icon.fas.fa-caret-down.q-select__dropdown-icon:before {
    content: "▲";
    font-size: 14px;
  }
</style>
