import { ref } from "vue";
import api from "@/api/crud";
import { useUtilities } from "@/composable/use-utilities";

const { notify } = useUtilities();

export default function useDataTable(url: string, key: string, opt?: any) {
  const filter = ref("");
  const loading = ref(false);
  const columnFilter = ref<Record<string, unknown>>();

  const pagination = ref({
    sortBy: key || "",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
  });

  const rows = ref([]);

  async function getDataTable(params: any) {
    try {
      const { data } = await api.get(url, params);
      return data || [];
    } catch (err) {
      if ((err as Error).message == "Network Error") {
        notify("No Internet Connection", "negative");
      } else {
        throw new Error(err);
      }
    }
  }

  const loadData = async (props: any) => {
    loading.value = true;
    const { page, rowsPerPage, sortBy, descending } = props.pagination;

    const sort = descending ? sortBy + "|desc" : sortBy;
    const filter = props.filter;

    const params = {
      page,
      per_page: rowsPerPage,
      sort,
      filter,
      column_filter: columnFilter.value
    };

    if (opt) {
      if (opt.isSite) params["siteId"] = opt.siteId;
      else params["businessId"] = opt.businessId;
    }

    const data = await getDataTable(params);

    loading.value = false;
    pagination.value.page = data.current_page;
    pagination.value.rowsPerPage = data.per_page;
    pagination.value.rowsNumber = data.total;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
    rows.value = data.data || [];
  };

  const onOrder = (order: any) => {
    loadData({ pagination: { ...pagination.value, page: 1, descending: order } });
  };

  const onRefresh = () => {
    loadData({ pagination: pagination.value });
  };

  const onSearch = (value: string) => {
    loadData({ filter: value, pagination: { ...pagination.value, page: 1 } });
  };

  const onSort = (sort: any) => {
    loadData({ pagination: { ...pagination.value, page: 1, sortBy: sort } });
  };

  return {
    columnFilter,
    filter,
    loading,
    pagination,
    rows,

    getDataTable,
    loadData,
    onOrder,
    onRefresh,
    onSearch,
    onSort
  };
}
