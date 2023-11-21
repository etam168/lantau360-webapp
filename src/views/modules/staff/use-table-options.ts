import { computed, ref } from "vue";
import { ActionButton } from "@/constants";
import { date } from "quasar";

import i18n from "@/plugins/i18n/i18n";
import useDataTable from "@/composable/use-data-table";

const { t, locale } = i18n.global;

export const url = "/Staff/Datatable";
export const key = "staffId";

export const toolTipCreate = ref("staff.create");
export const actionButtons = ref(ActionButton.EDIT);

export const { filter, loading, pagination, rows, loadData, onOrder, onRefresh, onSearch, onSort } =
  useDataTable(url, key);

export const columns = computed(() => [
  {
    name: "staffId",
    required: true,
    label: t("staff.columns.id"),
    align: "left",
    field: "staffId",
    sortable: true
  },
  {
    name: "firstName",
    required: true,
    label: t("staff.columns.firstName"),
    align: "left",
    field: (row: any) => {
      const lang = locale as any;
      return row.meta?.i18n?.[lang.value]?.firstName ?? row.firstName;
    },
    sortable: true
  },
  {
    name: "lastName",
    required: true,
    label: t("staff.columns.lastName"),
    align: "left",
    field: (row: any) => {
      const lang = locale as any;
      return row.meta?.i18n?.[lang.value]?.lastName ?? row.lastName;
    },
    sortable: true
  },
  {
    name: "email",
    required: true,
    label: t("staff.columns.email"),
    align: "left",
    field: "email",
    sortable: true
  },
  {
    name: "roleCode",
    required: true,
    label: t("staff.columns.roleCode"),
    align: "left",
    field: "roleCode",
    sortable: true
  },
  {
    name: "staffAlias",
    required: true,
    label: t("staff.columns.staffAlias"),
    align: "left",
    field: (row: any) => {
      const lang = locale as any;
      return row.meta?.i18n?.[lang.value]?.staffAlias ?? row.staffAlias;
    },
    sortable: true
  },
  {
    name: "status",
    required: true,
    label: t("staff.columns.status"),
    align: "left",
    field: (row: any) => {
      return row.status == 1 ? t("action.active") : t("action.inactive");
    },
    sortable: true
  },
  {
    name: "createdAt",
    required: true,
    label: t("staff.columns.createdAt"),
    align: "left",
    field: "createdAt",
    sortable: true,
    format: (val: Date) => date.formatDate(val, "YYYY-MM-DD HH:MM")
  },
  { name: "actionSlot", field: "", align: "center" }
]);
