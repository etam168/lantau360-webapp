<template>
  <q-table
    ref="qTableRef"
    v-bind="$attrs"
    binary-state-sort
    :rows-per-page-options="[20, 50, 100]"
    v-model:rows-per-page="rowsPerPage"
    class="sticky-header-column"
  >
    <template v-slot:top-left>
      <keyword-search @on-search="handleSearch" />
    </template>

    <template v-slot:top-right>
      <crud-top-right-slot
        :buttonOption="buttonOption"
        :toolTipCreate="toolTipCreate"
        @on-listingmodechange="handleListingModeChange"
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
          :style="col.width ? { minWidth: col.width, width: col.width } : {}"
        >
          {{ col.label }}
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
          :style="col.width ? { minWidth: col.width, width: col.width } : {}"
        >
          <template v-if="col.name == 'avatar'">
            <q-btn class="q-mt-sm" outline round color="black">
              <q-avatar>
                <img :src="col.value" />
              </q-avatar>
            </q-btn>
          </template>

          <template v-else-if="col.name == 'listingMode'">
            <listing-mode-column :listing-mode="col.value" />
          </template>

          <template v-else-if="col.name == 'chineseName'">
            <chinese-name-column :chinese-name="col.value" />
          </template>

          <template v-else-if="col.name == 'emailAndName'">
            <user-details-column :email-and-name="col.value" />
          </template>

          <template v-else-if="col.name == 'created'">
            <created-column :created="col.value" />
          </template>

          <template v-else-if="col.name == 'actionSlot'">
            <action-column
              @on-update="handleUpdate(props.row)"
              @on-gallery="handleGallery(props.row)"
              :actionButtons="1"
            />
          </template>

          <template v-else>
            <div class="q-mt-xs">
              {{ col.value }}
            </div>
          </template>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:bottom="scope">
      <div class="pagination-container">
        <q-btn flat v-show="!scope.isFirstPage" @click="scope.prevPage">Previous</q-btn>

        <q-pagination
          ref="qPaginationRef"
          v-model="scope.pagination.page"
          :max="scope.pagesNumber"
          :max-pages="6"
          color="white"
          text-color="blareck"
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

  // Custom Components
  const ActionColumn = defineAsyncComponent(() => import("./column/action-column.vue"));
  const ChineseNameColumn = defineAsyncComponent(() => import("./column/chinese-name-column.vue"));
  const ListingModeColumn = defineAsyncComponent(() => import("./column/listing-mode-column.vue"));
  const UserDetailsColumn = defineAsyncComponent(() => import("./column/user-details-column.vue"));
  const CreatedColumn = defineAsyncComponent(() => import("./column/created-column.vue"));
  const CrudTopRightSlot = defineAsyncComponent(() => import("./slot/crud-top-right-slot.vue"));
  const KeywordSearch = defineAsyncComponent(() => import("./slot/search-bar/keyword-search.vue"));

  defineProps({
    toolTipCreate: String,

    buttonOption: {
      type: Number,
      default: 1,
      required: false
    }
  });

  const qTableRef = ref(null);

  // Ref for q-pagination component
  const qPaginationRef = ref(null);

  const rowsPerPageOptions = [20, 50, 100];
  const rowsPerPage = ref(20);

  const emits = defineEmits([
    "on-create",
    "on-refresh",
    "on-search",
    "on-update",
    "on-gallery",
    "on-filterTable",
    "on-listingmodechange",
    "on-rowsperpage-change"
  ]);

  function handleCreate() {
    emits("on-create");
  }

  function handleRefresh() {
    emits("on-refresh");
  }

  function handleSearch(value: string) {
    emits("on-search", value);
  }

  function handleUpdate(props: any) {
    emits("on-update", props);
  }

  function handleGallery(props: any) {
    emits("on-gallery", props);
  }

  function handleListingModeChange(props: any) {
    emits("on-listingmodechange", props);
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
    //emits("on-pagination", val);
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
