import { ref, computed } from "vue";
import { ActionButton, CrudActionSlot } from "@/constants";
import i18n from "@/plugins/i18n/i18n";

import useDataTable from "@/composable/use-data-table";

import { date } from "quasar";

const { t, locale } = i18n.global;

export const url = "/Business/Datatable";
export const key = "businessId";

export const toolTipCreate = ref("business.create");
export const crudActionSlot = ref(CrudActionSlot.YES);
export const actionButtons = ref(ActionButton.EDIT);

export const { filter, loading, pagination, rows, loadData, onRefresh, onSearch, onSort } =
  useDataTable(url, key);

export const columns = computed(() => [
  {
    name: "businessId",
    required: true,
    label: t("business.columns.id"),
    align: "left",
    field: "businessId",
    sortable: true
  },
  {
    name: "businessName",
    required: true,
    label: t("business.columns.businessName"),
    align: "left",
    field: (row: any) => {
      const lang = locale as any;
      return row.meta?.i18n?.[lang.value]?.businessName ?? row.businessName;
    },
    sortable: true
  },
  {
    name: "title",
    required: true,
    label: t("business.columns.title"),
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
    label: t("business.columns.directoryId"),
    align: "left",
    field: "directoryId",
    sortable: true
  },
  {
    name: "status",
    required: true,
    label: t("business.columns.status"),
    align: "left",
    field: (row: any) => {
      return row.status == 1 ? t("action.active") : t("action.inactive");
    },
    sortable: true,
    width: "85px"
  },
  {
    name: "createdBy",
    required: true,
    label: t("business.columns.createdBy"),
    align: "left",
    field: "createdBy",
    sortable: true
  },
  {
    name: "createdAt",
    required: true,
    label: t("business.columns.createdAt"),
    align: "left",
    field: "createdAt",
    sortable: true,
    format: (val: Date) => date.formatDate(val, "YYYY-MM-DD HH:MM")
  },
  { name: "actionSlot", field: "", align: "right", width: "50px" }
]);
