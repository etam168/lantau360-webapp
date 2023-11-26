import { ref, computed } from "vue";
import { ActionButton } from "@/constants";
import i18n from "@/plugins/i18n/i18n";

import useDataTable from "@/composable/use-data-table";

const { t, locale } = i18n.global;

import { date } from "quasar";

export const url = "/Site/Datatable";
export const key = "siteId";

export const toolTipCreate = ref("site.create");

export const actionButtons = ref(ActionButton.EDIT);

export const { filter, loading, pagination, rows, loadData, onOrder, onRefresh, onSearch, onSort } =
  useDataTable(url, key);

export const columns = computed(() => [
  {
    name: "siteId",
    required: true,
    label: t("site.columns.id"),
    align: "left",
    field: "siteId",
    sortable: true
  },
  {
    name: "siteName",
    required: true,
    label: t("site.columns.siteName"),
    align: "left",
    field: (row: any) => {
      const lang = locale as any;
      return row.meta?.i18n?.[lang.value]?.siteName ?? row.siteName;
    },
    sortable: true
  },
  {
    name: "title",
    required: true,
    label: t("site.columns.title"),
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
    label: t("site.columns.directoryId"),
    align: "left",
    field: "directoryId",
    sortable: true
  },
  {
    name: "status",
    required: true,
    label: t("site.columns.status"),
    align: "left",
    field: (row: any) => {
      return row.status == 1 ? t("action.active") : t("action.inactive");
    },
    sortable: true
  },
  {
    name: "createdBy",
    required: true,
    label: t("site.columns.createdBy"),
    align: "left",
    field: "createdBy",
    sortable: true
  },
  {
    name: "createdAt",
    required: true,
    label: t("site.columns.createdAt"),
    align: "left",
    field: "createdAt",
    sortable: true,
    format: (val: Date) => date.formatDate(val, "YYYY-MM-DD HH:MM")
  },
  { name: "actionSlot", field: "", align: "right", width: "50px" }
]);
