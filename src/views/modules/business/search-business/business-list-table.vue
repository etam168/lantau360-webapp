<template>
  <q-table
    ref="qTableRef"
    v-bind="$attrs"
    binary-state-sort
    flat
    square
    grid
    :rows-per-page-options="[25, 30, 50]"
    :rows-per-page="25"
  >
    <template #item="props">
      <business-item class="col-12" :row="props.row" @on-detail="handleDetail(props.row)" />
    </template>

    <!-- <template v-slot:bottom="scope">
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
    </template> -->
  </q-table>
</template>

<script setup lang="ts">
  import businessItem from "./business-item.vue";
  import { QTable } from "quasar";
  import { ref } from "vue";

  const qTableRef = ref(null);

  const emits = defineEmits(["on-contact", "on-detail", "on-pagination"]);

  defineProps({
    hidePagination: { type: Boolean, default: false }
  });

  function handleDetail(props: any) {
    emits("on-detail", props);
  }

  // function updatePagination(val: any, scope: any) {
  //   if (qTableRef.value) {
  //     const qTable = qTableRef.value as QTable;
  //     const { pagination } = scope;

  //     if (pagination) {
  //       pagination.page = val;
  //       qTable.requestServerInteraction({
  //         pagination: {
  //           ...pagination,
  //           sortBy: pagination.sortBy || undefined
  //         }
  //       });
  //     }
  //   }
  // }
</script>

<style lang="scss">
  .custom-grid-item {
    width: 100%;

    /* Oberrid the style lg breakpoint */
  }
  .grid-style-transition {
    transition:
      transform 0.28s,
      background-color 0.28s;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }
</style>
