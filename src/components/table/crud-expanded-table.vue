<template>
  <q-table
    ref="qTableRef"
    v-model:expanded="expanded"
    v-bind="$attrs"
    binary-state-sort
    :rows-per-page-options="[20, 50, 100]"
    v-model:rows-per-page="rowsPerPage"
    class="sticky-header-column"
    selection="multiple"
    v-model:selected="selectedRecords"
  >
    <template v-slot:top>
      <div class="flex-container">
        <keyword-search @on-search="handleSearch" />
        <crud-top-right-slot
          :buttonOption="buttonOption"
          :toolTipCreate="toolTipCreate"
          @on-listingmodechange="handleListingModeChange"
          @on-create="handleCreate"
          @on-refresh="handleRefresh"
          @on-recommend="handleRecommendation"
          @on-whatsapp-recommend="handleWhatsappRecommendation"
          @on-agent-update="handleAgentUpdate"
          @on-advance-search="handleAdvanceSearchClick"
        />
      </div>
      <amenity-search
        v-if="buttonOption == 8"
        :search-bar-data="amenities"
        @on-search="handleSearch"
        @on-amenity="handleAmenityChange"
      />

      <!-- <listing-search
        v-else-if="buttonOption == 4 || buttonOption == 5 || buttonOption == 6 || buttonOption == 7"
        :searchBarData="searchBarData"
        @on-filter="filterTable"
        @on-search="handleSearch"
      /> -->
    </template>

    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width> </q-th>
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          :style="col.width ? { minWidth: col.width, width: col.width } : {}"
        >
          <q-checkbox
            dense
            class="q-mb-md"
            v-if="col.name === 'selection'"
            v-model="props.selected"
            @update:model-value="onRecordSelection"
          />
          <span v-else>{{ col.label }}</span>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td :style="{ width: props.cols.width || 'auto' }">
          <q-btn
            size="sm"
            color="primary"
            round
            dense
            @click="toggleExpanded(props.key)"
            :icon="props.expand ? 'remove' : 'add'"
          />
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          :class="props.row ? 'vertical-top' : ''"
          :style="col.width ? { minWidth: col.width, width: col.width } : {}"
        >
          <!-- <template v-if="col.name == 'avatar'">
            <q-btn class="q-mt-sm" outline round color="black">
              <q-avatar>
                <img :src="col.value" />
              </q-avatar>
            </q-btn>
          </template> -->

          <template v-if="col.name == 'listingTitle'">
            <listing-title-column
              :title="col.value.title"
              :listingMode="col.value.listingMode"
              :colWidth="col.width"
            />
          </template>

          <template v-else-if="col.name == 'listingMode'">
            <listing-mode-column :listing-mode="col.value" />
          </template>
          <template v-else-if="col.name === 'chineseTitle' || col.name === 'chineseName'">
            <chinese-name-column :chinese-name="col.value" />
          </template>

          <template v-else-if="col.name == 'created'">
            <created-column :created="col.value" />
          </template>

          <template v-else-if="col.name == 'actionSlot'">
            <action-column
              @on-update="handleUpdate(props.row)"
              @on-gallery="handleGallery(props.row)"
              :actionButtons="actionButtons"
            />
          </template>

          <template v-else-if="col.name == 'selection'">
            <q-checkbox
              dense
              v-model="props.selected"
              @update:model-value="onRecordSelection"
            ></q-checkbox>
          </template>

          <template v-else>
            <div class="q-mt-xs">{{ col.value }}</div>
          </template>
        </q-td>
      </q-tr>

      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%" class="bg-grey-4">
          <!-- <div class="row"> -->
          <component :is="expandedRow" :props="props" :rowData="props.row" />
          <!-- </div> -->
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
  import { PropType, defineAsyncComponent, ref, watch } from "vue";

  // .ts files
  import { Amenity } from "@/interfaces/models/entities/amenity";
  import { QTable } from "quasar";

  // Custom Components
  const ActionColumn = defineAsyncComponent(() => import("./column/action-column.vue"));
  const ChineseNameColumn = defineAsyncComponent(() => import("./column/chinese-name-column.vue"));
  const ListingModeColumn = defineAsyncComponent(() => import("./column/listing-mode-column.vue"));
  const CreatedColumn = defineAsyncComponent(() => import("./column/created-column.vue"));
  const listingTitleColumn = defineAsyncComponent(
    () => import("./column/listing-title-column.vue")
  );

  const CrudTopRightSlot = defineAsyncComponent(() => import("./slot/crud-top-right-slot.vue"));
  const AmenitySearch = defineAsyncComponent(() => import("./slot/search-bar/amenity-search.vue"));
  const KeywordSearch = defineAsyncComponent(() => import("./slot/search-bar/keyword-search.vue"));
  // const ListingSearch = defineAsyncComponent(
  //   () => import("./slot/search-bar/listing-search/index.vue")
  // );
  const selectedRecords = ref([]);
  const qTableRef = ref(null);

  // Ref for q-pagination component
  const qPaginationRef = ref(null);

  const rowsPerPageOptions = [20, 50, 100];
  const rowsPerPage = ref(20);

  defineProps({
    toolTipCreate: String,
    buttonOption: {
      type: Number,
      default: 1,
      required: false
    },
    amenities: {
      type: Array as PropType<Array<Amenity>>,
      default: () => [],
      required: false
    },
    expandedRow: {
      type: Object as any,
      required: true
    },
    searchBarData: {
      type: Object
    },
    actionButtons: {
      default: 1,
      required: false
    }
  });

  const emits = defineEmits([
    "on-create",
    "on-refresh",
    "on-search",
    "on-update",
    "on-advance-search",
    "on-gallery",
    "on-amenitychange",
    "on-filterTable",
    "on-listingmodechange",
    "on-selection",
    "on-selection-record",
    "on-recommend",
    "on-whatsapp-recommend",
    "on-agent-update",
    "on-rowsperpage-change"
  ]);

  const expanded = ref<(string | number)[]>([]);

  function handleCreate() {
    emits("on-create");
  }

  function handleRecommendation() {
    emits("on-recommend");
  }

  function handleWhatsappRecommendation() {
    emits("on-whatsapp-recommend");
  }

  function handleAgentUpdate() {
    emits("on-agent-update");
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

  // function filterTable(val: any) {
  //   emits("on-filterTable", val);
  // }

  function handleAmenityChange(val: any) {
    emits("on-amenitychange", val);
  }

  function handleAdvanceSearchClick() {
    emits("on-advance-search");
  }

  function toggleExpanded(val: string | number) {
    expanded.value = expanded.value[0] === val ? [] : [val];
  }

  function handleListingModeChange(props: any) {
    emits("on-listingmodechange", props);
  }

  function onRecordSelection() {
    emits("on-selection", selectedRecords);
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
  .flex-container {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }
</style>
