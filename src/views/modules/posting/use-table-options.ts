import { ref, computed } from "vue";
import { ActionButton } from "@/constants";
import i18n from "@/plugins/i18n/i18n";

import useDataTable from "@/composable/use-data-table";

const { t, locale } = i18n.global;

import { date } from "quasar";

export const url = "/Posting/Datatable";
export const key = "postingId";

export const toolTipCreate = ref("posting.create");

export const actionButtons = ref(ActionButton.GALLERY | ActionButton.EDIT);

export const { filter, loading, pagination, rows, loadData, onOrder, onRefresh, onSearch, onSort } =
  useDataTable(url, key);

export const columns = computed(() => [
  {
    name: "postingId",
    required: true,
    label: t("posting.columns.id"),
    align: "left",
    field: "postingId",
    sortable: true
  },
  {
    name: "postingName",
    required: true,
    label: t("posting.columns.postingName"),
    align: "left",
    field: (row: any) => {
      const lang = locale as any;
      return row.meta?.i18n?.[lang.value]?.postingName ?? row.siteName;
    },
    sortable: true
  },
  {
    name: "title",
    required: true,
    label: t("posting.columns.title"),
    align: "left",
    field: (row: any) => {
      const lang = locale as any;
      return row.meta?.i18n?.[lang.value]?.title ?? row.title;
    },
    sortable: true
  },
  {
    name: "directoryId",
    required: true,
    label: t("posting.columns.directoryId"),
    align: "left",
    field: "directoryId",
    sortable: true
  },
  {
    name: "status",
    required: true,
    label: t("posting.columns.status"),
    align: "left",
    field: (row: any) => {
      return row.status == 1 ? t("action.active") : t("action.inactive");
    },
    sortable: true
  },
  {
    name: "createdBy",
    required: true,
    label: t("posting.columns.createdBy"),
    align: "left",
    field: "createdBy",
    sortable: true
  },
  {
    name: "createdAt",
    required: true,
    label: t("posting.columns.createdAt"),
    align: "left",
    field: "createdAt",
    sortable: true,
    format: (val: Date) => date.formatDate(val, "YYYY-MM-DD HH:MM")
  }
]);
