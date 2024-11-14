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
      <list-item class="col-12" :entityKey :item="props.row" @on-detail="handleDetail(props.row)" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Quasar Import
  import { QTable } from "quasar";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Custom Components
  import listItem from "./list-item.vue";

  // Emit
  const emits = defineEmits(["on-contact", "on-detail", "on-pagination"]);

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  // Reactive variables
  const qTableRef = ref(null);

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
