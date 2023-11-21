<template>
  <q-table
    ref="qTableRef"
    v-bind="$attrs"
    binary-state-sort
    :rows-per-page-options="[20, 50, 100]"
    v-model:rows-per-page="rowsPerPage"
    class="sticky-header-column"
    :title="isSearch === false ? $t('route.drawerComponents.memo') : ''"
  >
    <template v-slot:top-left v-if="isSearch">
      <keyword-search @on-search="handleSearch" />
    </template>

    <template v-slot:top-right>
      <crud-top-right-slot
        :button-option="buttonOption"
        :toolTipCreate="toolTipCreate"
        @on-create="handleCreate"
        @on-refresh="handleRefresh"
      />
    </template>

    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          :style="col.width ? { maxWidth: col.width, width: col.width } : {}"
        >
          <span>{{ col.label }}</span>
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          :class="props.row ? 'vertical-top' : ''"
          :style="col.width ? { maxWidth: col.width, width: col.width } : {}"
        >
          <template v-if="col.name == 'title'">
            <memo-column :title="col.value" />
          </template>

          <template v-else-if="col.name == 'created'">
            <created-column :created="col.value" />
          </template>

          <template v-else>
            <div class="q-mt-xs">{{ col.value }}</div>
          </template>
        </q-td>
      </q-tr>
    </template>
    <template v-slot:bottom="scope">
      <div class="pagination-container">
        <q-btn flat v-show="!scope.isFirstPage" @click="scope.prevPage">Previous</q-btn>

        <q-pagination
          v-model="scope.pagination.page"
          :max="scope.pagesNumber"
          :max-pages="6"
          color="white"
          text-color="black"
          gutter="15px"
          @update:model-value="updatePagination(scope.pagination.page, scope)"
        />
        <q-btn flat v-show="!scope.isLastPage" @click="scope.nextPage">Next</q-btn>
      </div>
      <div class="rows-per-page-select">
        <label for="rowsPerPageSelect" class="q-mr-sm">Rows per page:</label>
        <select id="rowsPerPageSelect" v-model="rowsPerPage">
          <option v-for="option in rowsPerPageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Vue Import
  import { QTable } from "quasar";
  import { defineAsyncComponent, ref, watch } from "vue";

  const qTableRef = ref(null);
  // Custom Components
  // import AppPageTitle from "@/components/widgets/app-page-title.vue";
  const CreatedColumn = defineAsyncComponent(() => import("./column/created-column.vue"));
  const CrudTopRightSlot = defineAsyncComponent(() => import("./slot/crud-top-right-slot.vue"));
  const MemoColumn = defineAsyncComponent(() => import("./column/memo-column.vue"));
  const KeywordSearch = defineAsyncComponent(() => import("./slot/search-bar/keyword-search.vue"));

  defineProps({
    toolTipCreate: String,
    buttonOption: Number,
    isSearch: {
      type: Boolean,
      default: true
    }
  });

  const rowsPerPageOptions = [20, 50, 100];
  const rowsPerPage = ref(20);
  const emits = defineEmits(["on-create", "on-refresh", "on-search", "on-rowsperpage-change"]);

  function handleCreate() {
    emits("on-create");
  }

  function handleRefresh() {
    emits("on-refresh");
  }

  function handleSearch(value: string) {
    emits("on-search", value);
  }
  function updatePagination(val: any, scope: any) {
    if (qTableRef.value) {
      const qTable = qTableRef.value as QTable;
      const { pagination } = scope;

      if (pagination) {
        pagination.page = val;
        qTable.requestServerInteraction({
          pagination: {
            ...pagination,
            sortBy: pagination.sortBy || undefined
          }
        });
      }
    }
  }
  // Watch for changes in rowsPerPage and reset the page to 1
  watch(rowsPerPage, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      // Set the current page to 1 when rowsPerPage changes
      emits("on-rowsperpage-change", newVal);
    }
  });
</script>
<style>
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }
</style>
