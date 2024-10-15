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
  import { EntityURLKey } from "@/constants/app/entity-url";
  import listItem from "./list-item.vue";
  import { QTable } from "quasar";
  import { ref } from "vue";

  const qTableRef = ref(null);

  const emits = defineEmits(["on-contact", "on-detail", "on-pagination"]);

  // defineProps({
  //   hidePagination: { type: Boolean, default: false }
  // });

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

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
