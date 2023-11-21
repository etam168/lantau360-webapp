import { ref, computed } from "vue";
import { ActionButton } from "@/constants";
import { date } from "quasar";

import i18n from "@/plugins/i18n/i18n";
import useDataTable from "@/composable/use-data-table";

const { t, locale } = i18n.global;

export const url = "/Directory/Datatable";
export const key = "directoryId";
export const toolTipCreate = ref("directory.create");
export const actionButtons = ref(ActionButton.DETAIL | ActionButton.EDIT);

export const { filter, loading, pagination, rows, loadData, onRefresh, onSearch } = useDataTable(
  url,
  key
);

export const columns = computed(() => [
  {
    name: "directoryId",
    required: true,
    label: t("directory.columns.id"),
    align: "left",
    field: "directoryId",
    sortable: true,
    width: "65px"
  },
  {
    name: "avatar",
    required: true,
    label: "Icon",
    align: "left",
    field: "imagePath",
    sortable: true,
    width: "65px"
  },
  {
    name: "directoryName",
    required: true,
    label: t("directory.columns.directoryName"),
    align: "left",
    field: "directoryName",
    width: "180px",
    sortable: true
  },
  {
    name: "directoryNameHk",
    required: true,
    label: t("directory.columns.directoryNameHk"),
    align: "left",
    // field: "directoryNameHk",
    field: (row: any) => {
      return row.meta?.i18n?.hk?.directoryName ?? row.directoryName;
    },
    width: "180px",
    sortable: true
  },
  {
    name: "directoryNameCn",
    required: true,
    label: t("directory.columns.directoryNameCn"),
    align: "left",
    // field: "directoryNameCn",
    field: (row: any) => {
      return row.meta?.i18n?.cn?.directoryName ?? row.directoryName;
    },
    width: "180px",
    sortable: true
  },
  {
    name: "shortName",
    required: true,
    label: t("directory.columns.shortName"),
    align: "left",
    field: (row: any) => {
      const lang = locale as any;
      return row.meta?.i18n?.[lang.value]?.shortName ?? row.shortName;
    },
    sortable: true
  },
  {
    name: "groupId",
    required: true,
    label: t("directory.columns.groupId"),
    align: "left",
    field: "groupId",
    sortable: true
  },
  {
    name: "status",
    required: true,
    label: t("directory.columns.status"),
    align: "left",
    field: (row: any) => {
      return row.status == 1 ? t("action.active") : t("action.inactive");
    },
    sortable: true
  },
  {
    name: "createdBy",
    required: true,
    label: t("directory.columns.createdBy"),
    align: "left",
    field: "createdBy",
    sortable: true,
    width: "40px"
  },
  {
    name: "createdAt",
    required: true,
    label: t("directory.columns.createdAt"),
    align: "left",
    field: (row: any) => {
      const createdAt = row.createdAt;
      const createdAtyDate = new Date(createdAt);
      return date.formatDate(createdAtyDate, "YYYY-MM-DD HH:MM");
    },
    width: "140px",
    sortable: true
  },
  { name: "actionSlot", field: "", align: "left" }
]);
