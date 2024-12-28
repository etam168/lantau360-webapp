<template>
  <q-card-actions class="full-width row items-center">
    <template v-if="!scope.isFirstPage || !scope.isLastPage">
      <div class="col-12 col-sm-8 offset-sm-2 row items-center justify-center q-gutter-sm">
        <q-btn
          flat
          :disable="scope.isFirstPage"
          @click="scope.prevPage"
          :icon="fasChevronLeft"
          size="sm"
          :color="scope.isFirstPage ? 'grey-6' : 'primary'"
        />

        <q-pagination
          v-model="scope.pagination.page"
          :max="scope.pagesNumber"
          :max-pages="6"
          color="white"
          text-color="black"
          @update:model-value="updatePagination"
        />

        <q-btn
          flat
          :disable="scope.isLastPage"
          @click="scope.nextPage"
          :icon="fasChevronRight"
          size="sm"
          :color="scope.isLastPage ? 'grey-6' : 'primary'"
        />
      </div>
    </template>

    <div
      :class="{
        'col-12 col-sm-2 row items-center justify-end': true,
        'offset-sm-10': scope.isFirstPage && scope.isLastPage
      }"
    >
      <div class="rows-per-page-select">
        <q-select
          v-model="scope.pagination.rowsPerPage"
          :options="rowsPerPageOptions"
          dense
          options-dense
          borderless
          emit-value
          @update:model-value="updateRowsPerPage"
        >
          <template v-slot:before>
            <div class="text-subtitle2">{{ $t("action.rowsPerPage") }}</div>
          </template>
        </q-select>
      </div>
    </div>
  </q-card-actions>
</template>

<script setup lang="ts">
  import { fasChevronLeft, fasChevronRight } from "@quasar/extras/fontawesome-v6";
  import type { TableBottomScope } from "@/interfaces/quasar/table-bottom-scopt";
  import { QTableProps } from "quasar";

  const emit = defineEmits<{
    (e: "update:pagination", value: QTableProps["pagination"]): void;
  }>();

  const props = defineProps({
    scope: {
      type: Object as PropType<TableBottomScope>,
      required: true
    },
    rowsPerPageOptions: {
      type: Array as PropType<number[]>,
      required: true
    }
  });

  const rowsPerPageOptions = ref(
    props.rowsPerPageOptions.map(value => ({
      label: value.toString(),
      value: value
    }))
  );

  function updatePagination(page: number) {
    emit("update:pagination", { ...props.scope.pagination });
  }

  function updateRowsPerPage(value: number) {
    emit("update:pagination", { ...props.scope.pagination });
  }
</script>
