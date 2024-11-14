<template>
  <q-item>
    <q-item-label> <div v-html="translatedContent"></div></q-item-label>
  </q-item>
</template>

<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{
    category: CategoryTypes;
  }>();

  const { translate } = useUtilities();

  const translatedContent = ref(translate(category.description, category.meta, "description"));
</script>
