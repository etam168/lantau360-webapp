<template>
  <div :class="$q.screen.gt.xs ? 'row' : ''" class="q-gutter-md">
    <daytrip-card :directory-items="directoryItems" @item-click="handleItemClick" />
  </div>
</template>
<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import DaytripCard from "@/components/card/daytrip-card.vue";

  const emit = defineEmits(["item-click"]);

  defineProps({
    directoryItems: {
      type: Array as PropType<CategoryTypes[]>,
      required: true,
      default: () => []
    }
  });

  function handleItemClick(item: CategoryTypes) {
    emit("item-click", item);
  }
</script>
