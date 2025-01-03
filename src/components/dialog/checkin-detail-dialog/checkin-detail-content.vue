<template>
  <q-table
    ref="qTableRef"
    v-bind="$attrs"
    :card-style="scrollAreaStyle"
    class="sticky-header-column q-ma-md"
    :rows="getCheckinRows(item)"
    :columns="columns"
    row-key="description"
    v-model:pagination="pagination"
    :dense="$q.screen.lt.md"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name === 'description'">
            <q-item dense class="q-pa-none">
              <q-item-section>
                <q-item-label>
                  {{ props.row.description }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <template v-if="col.name === 'checkInAt'">
            <q-item dense class="q-pa-none">
              <q-item-section>
                <q-item-label>{{ dateFormatter(props.row.checkInAt) }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:pagination="scope">
      <q-btn
        :icon="fasAngleLeft"
        color="grey-8"
        round
        dense
        flat
        :disable="scope.isFirstPage"
        @click="scope.prevPage"
      />
      <q-btn
        :icon="fasAngleRight"
        color="grey-8"
        round
        dense
        flat
        :disable="scope.isLastPage"
        @click="scope.nextPage"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import { QTable, QTableColumn } from "quasar";
  import { fasAngleLeft, fasAngleRight } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";

  const { item } = defineProps<{
    item: CheckInView;
  }>();

  // Pagination state
  const pagination = ref({
    sortBy: "description",
    descending: false,
    page: 1,
    rowsPerPage: 20
  });

  const { dateFormatter } = useUtilities();

  // Columns configuration for the table
  const columns = computed(() => {
    return [
      { name: "description", label: "Description", align: "left", field: "directoryName" },
      { name: "checkInAt", label: "Check-in Date", align: "center", field: "checkInAt" }
    ] as QTableColumn[];
  });

  // Rows data - accessing checkInfo from the item prop
  const getCheckinRows = (item: any) => {
    return item.siteData?.checkInfo || []; // Ensure checkInfo exists
  };

  // Handle scroll area height
  const $q = useQuasar();
  const MEMBER_POINTS_HEIGHT = 76;
  const OTHER_HEIGHT = 96 + 72;

  const usedHeight = computed(() => MEMBER_POINTS_HEIGHT + OTHER_HEIGHT);

  const scrollAreaStyle = computed(() => {
    return $q.screen.height > 600 ? { height: `calc(100vh - ${usedHeight.value}px)` } : "";
  });
</script>
