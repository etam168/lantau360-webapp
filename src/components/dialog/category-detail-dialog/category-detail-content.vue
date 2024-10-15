<template>
    <default-renderer :category :entityKey/>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { EntityURLKey, RENDERER, TEMPLATE } from "@/constants";

  // Custom Components
  import DefaultRenderer from "@/components/renderer/default-renderer.vue";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();



</script>
