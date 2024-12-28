<template>
  <q-table
    ref="qTableRef"
    v-bind="$attrs"
    :rows-per-page="rowsPerPage"
    :rows-per-page-options="rowsPerPageOptions"
    class="sticky-header-column q-ma-md"
    binary-state-sort
    :rows="transactionItem"
    :pagination="pagination"
    :hide-bottom="showBottom ? true : false"
    :columns="columns"
    row-key="description"
    :dense="$q.screen.lt.md"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name == 'description'">
            <q-item dense class="q-pa-none">
              <q-item-section>
                <q-item-label>{{ props.row.title }}</q-item-label>
                <q-item-label caption>
                  {{
                    props.row.directoryName
                      ? `${props.row.directoryName} - ${dateFormatter(props.row.createdAt)}`
                      : dateFormatter(props.row.createdAt)
                  }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </template>

          <template v-if="col.name == 'points'">
            <q-item dense class="q-pa-none">
              <q-item-section>
                <q-item-label :class="props.row.transactionType === 2 ? 'text-red' : ''">
                  {{
                    props.row.transactionType === 2 ? `${props.row.points}` : props.row.points
                  }}</q-item-label
                >
                <q-item-label caption v-if="props.row.isPostExpired" class="text-red q-ml-sm">
                  {{ $t(`${i18nKey}.account.expired`) }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </template>
        </q-td>
      </q-tr>
    </template>

    <template #bottom="scope">
      <standard-bottom-slot :scope :rowsPerPageOptions @update:pagination="updatePagination" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import type { TransactionView } from "@/interfaces/models/views/trasaction-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import { EntityURLKey } from "@/constants";
  import { QTableColumn } from "quasar";

  const { dateFormatter } = useUtilities();

  const emits = defineEmits(["on-member-detail"]);

  // Props
  const { memberItems, entityKey, showBottom } = defineProps<{
    memberItems: CategoryTypes[];
    entityKey: EntityURLKey;
    showBottom?: boolean;
  }>();

  const transactionItem = ref<TransactionView[]>(memberItems as TransactionView[]);
  const i18nKey = "more.mainMenuDialog";
  const $q = useQuasar();
  const rowsPerPageOptions = [10, 50, 100];
  const rowsPerPage = ref(10);

  // Define pagination
  const pagination = ref({
    sortBy: "description",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: transactionItem.value.length
  });

  // Columns definition for the table
  const columns = computed(() => {
    return [
      {
        name: "description",
        label: "Description",
        required: true,
        align: "left",
        field: "title"
      },
      {
        name: "points",
        label: "Points",
        required: true,
        align: "center",
        field: "points"
      }
    ] as QTableColumn[];
  });

  function updatePagination(event: any) {
    pagination.value = {
      ...pagination.value,
      ...event
    };
  }
</script>
