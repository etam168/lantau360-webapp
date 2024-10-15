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
