import { computed, ref } from "vue";
import { ActionButton } from "@/constants";
import { date } from "quasar";
import { ButtonOption } from "@/constants";

import i18n from "@/plugins/i18n/i18n";
import useDataTable from "@/composable/use-data-table";

const { t } = i18n.global;

export const url = "/Member/Datatable";
export const key = "memberId";

export const toolTipCreate = ref("member.create");
export const buttonOption = computed(() => ButtonOption.NOCREATE);
export const actionButtons = ref(ActionButton.EDIT);

export const { filter, loading, pagination, rows, loadData, onOrder, onRefresh, onSearch, onSort } =
  useDataTable(url, key);

export const columns = computed(() => [
  {
    name: "memberId",
    required: true,
    label: t("member.columns.id"),
    align: "left",
    field: "memberId",
    sortable: true
  },
  {
    name: "firstName",
    required: true,
    label: t("member.columns.firstName"),
    align: "left",
    field: "firstName",
    sortable: true
  },
  {
    name: "lastName",
    required: true,
    label: t("member.columns.lastName"),
    align: "left",
    field: "lastName",
    sortable: true
  },
  {
    name: "email",
    required: true,
    label: t("member.columns.email"),
    align: "left",
    field: "email",
    sortable: true
  },
  {
    name: "phone",
    required: true,
    label: t("member.columns.phone"),
    align: "left",
    field: "phone",
    sortable: true
  },
  {
    name: "alias",
    required: true,
    label: t("member.columns.alias"),
    align: "left",
    field: "alias",
    sortable: true
  },
  {
    name: "status",
    required: true,
    label: t("member.columns.status"),
    align: "left",
    field: (row: any) => {
      return row.status == 1 ? t("action.active") : t("action.inactive");
    },
    sortable: true
  },
  {
    name: "createdBy",
    required: true,
    label: t("member.columns.createdBy"),
    align: "left",
    field: "createdBy",
    sortable: true,
    width: "40px"
  },
  {
    name: "createdAt",
    required: true,
    label: t("member.columns.createdAt"),
    align: "left",
    field: "createdAt",
    sortable: true,
    format: (val: Date) => date.formatDate(val, "YYYY-MM-DD HH:MM")
  },
  { name: "actionSlot", field: "", align: "center" }
]);
