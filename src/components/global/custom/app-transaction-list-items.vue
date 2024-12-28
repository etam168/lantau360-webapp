<template>
  <q-table
    :rows="transactionItem"
    :pagination="pagination"
    :hide-bottom="showBottom ? true : false"
    :columns="columns"
    row-key="id"
    class="q-ma-md"
    :dense="true"
  >
    <template v-slot:top-right>
      <!-- Optional additional controls can go here -->
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import type { TransactionView } from "@/interfaces/models/views/trasaction-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import { EntityURLKey } from "@/constants";
  import { QTableColumn } from "quasar";

  // Internal plugin imports
  import i18n from "@/plugins/i18n/i18n";

  const { dateFormatter } = useUtilities();

  const emits = defineEmits(["on-member-detail"]);

  // Props
  const { memberItems, entityKey, showBottom } = defineProps<{
    memberItems: CategoryTypes[];
    entityKey: EntityURLKey;
    showBottom: boolean;
  }>();

  const transactionItem = ref<TransactionView[]>(memberItems as TransactionView[]);
  const i18nKey = "more.mainMenuDialog";
  const { t } = i18n.global;

  // Define pagination
  const pagination = ref({
    page: 1,
    rowsPerPage: 20,
    rowsNumber: transactionItem.value.length
  });

  // Columns definition for the table
  const columns = computed(() => {
    const cols: Partial<QTableColumn>[] = [
      {
        name: "title",
        label: "Title",
        required: true,
        align: "left",
        field: "title"
      },
      {
        name: "directory",
        label: "Directory - Date",
        required: true,
        align: "left",
        field: "directoryName",
        format: (val: string, row: any) => {
          return val ? `${val} - ${dateFormatter(row.createdAt)}` : dateFormatter(row.createdAt);
        }
      },
      {
        name: "points",
        label: "Points",
        required: true,
        align: "center",
        field: "points",
        format: (val: number, row: any) => {
          return row.transactionType === 2 ? `-${val}` : `${val}`; // Ensure this always returns a string
        }
      },
      {
        name: "expired",
        label: "Expired",
        required: true,
        align: "center",
        field: "isPostExpired",
        format: (val: boolean) => (val ? "Expired" : "")
      }
    ];

    return cols.map(col =>
      col.name === "actionSlot"
        ? col
        : {
            ...col,
            // label: t(`${entity}.columns.${col.name}`, col.name as string),
            align: col.align || "left",
            required: col.required !== false,
            sortable: col.sortable !== false
          }
    ) as QTableColumn[];
  });
</script>
