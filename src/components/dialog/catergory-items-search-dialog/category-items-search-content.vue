<!-- category-items-search-content.vue -->
<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    hide-pagination
    separator="cell"
    :rowKey
    :rows="sortedRows"
    :rows-per-page-options="[0]"
  >
    <template v-slot:top>
      <q-card-actions class="full-width" align="center">
        <app-search-bar
          v-model:keyword="keyword"
          @on-search="onSearch"
          @on-clear-input="onClearInput"
        />
      </q-card-actions>
    </template>

    <template v-slot:body="{ row }">
      <q-tr>
        <q-td colspan="100%">
          <app-category-item
            :categoryItem="row"
            :entityKey
            @on-directory-item="onCategoryDetail(row)"
          />
        </q-td>
      </q-tr>
    </template>
    <template v-slot:no-data>
      <div class="text-h6 text-center q-pa-md text-grey-6 text-weight-bold full-width">
        {{ $t("errors.noRecord") }}
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import useDataTable from "@/composable/use-data-table";
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Props
  const { entityKey, sortByKey = "default" } = defineProps<{
    entityKey: EntityURLKey;
    sortByKey?: string;
  }>();

  // v-model
  const keyword = defineModel<string>("keyword", {
    required: false,
    default: ""
  });

  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { sortCategoryTypes } = useSortCategoryItems(entityKey);
  const { getEntityKeyName } = useUtilities();

  const entityUrl = computed(() => `${ENTITY_URL[entityKey]}/Datatable`);
  const rowKey = getEntityKeyName(entityKey);
  const { filter, pagination, rows, loadData } = useDataTable(entityUrl.value, rowKey);
  const isDialogOpen = ref(false);

  const sortedRows = computed(() => {
    return sortCategoryTypes(rows.value, sortByKey);
  });

  function onClearInput() {
    rows.value = [];
  }

  function onSearch(val: any) {
    filter.value = val;
    loadData({ pagination: pagination.value });
  }

  async function onCategoryDetail(item: any) {
    openCategoryDetailDialog(isDialogOpen, item, entityKey);
  }

  onMounted(() => {
    // Check if the route query is an object and contains the key searchKeyword
    if (keyword !== undefined) {
      // Do something with the searchKeyword value
      filter.value = keyword.value;
      pagination.value.rowsPerPage = 100;
    }
    loadData({ pagination: pagination.value });
  });
</script>
