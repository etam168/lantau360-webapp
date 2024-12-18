<template>
  <q-scroll-area style="height: calc(100vh - 262.75px)">
    <q-item>
      <q-item-label> <div v-html="translatedContent"></div></q-item-label>
    </q-item>
  </q-scroll-area>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{
    category: CategoryTypes;
  }>();

  // Composable function calls

  const { locale } = useI18n({ useScope: "global" });

  const { translate } = useUtilities(locale.value);

  // Reactive variables
  const translatedContent = ref(translate(category.description, category.meta, "description"));
</script>
