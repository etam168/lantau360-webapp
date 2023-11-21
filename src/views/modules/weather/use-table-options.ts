import { ref, computed } from "vue";
import { ActionButton } from "@/constants";
import { date } from "quasar";

import i18n from "@/plugins/i18n/i18n";
import useDataTable from "@/composable/use-data-table";

// import { useUtilities } from "@/composable/use-utilities";

// const { translateAltName } = useUtilities();
const { t, locale } = i18n.global;

export const url = "/WeatherIcon/Datatable";
export const key = "weatherIconId";
export const toolTipCreate = ref("weather.create");
export const actionButtons = ref(ActionButton.EDIT);

export const { filter, loading, pagination, rows, loadData, onRefresh, onSearch } = useDataTable(
  url,
  key
);

export const columns = computed(() => [
  {
    name: "weatherIconId",
    required: true,
    label: t("weather.columns.id"),
    align: "left",
    field: "weatherIconId",
    sortable: true,
    width: "65px"
  },
  {
    name: "iconNo",
    required: true,
    label: t("weather.columns.iconNo"),
    align: "left",
    field: "iconNo",
    width: "180px",
    sortable: true
  },
  {
    name: "caption",
    required: true,
    label: t("weather.columns.caption"),
    align: "left",
    field: (row: any) => {
      const lang = locale as any;
      return row.meta?.i18n?.[lang.value]?.caption ?? row.caption;
    },
    sortable: true
  },
  {
    name: "captionHk",
    required: true,
    label: t("weather.columns.captionHk"),
    align: "left",
    field: (row: any) => {
      return row.meta?.i18n?.["hk"]?.caption;
    },
    sortable: true
  },
  {
    name: "captionCn",
    required: true,
    label: t("weather.columns.captionCn"),
    align: "left",
    field: (row: any) => {
      return row.meta?.i18n?.["cn"]?.caption;
    },
    sortable: true
  },
  {
    name: "createdBy",
    required: true,
    label: t("weather.columns.createdBy"),
    align: "left",
    field: "createdBy",
    sortable: true,
    width: "40px"
  },
  {
    name: "createdAt",
    required: true,
    label: t("weather.columns.createdAt"),
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
