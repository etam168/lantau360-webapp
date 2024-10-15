<template>
  <q-card-section class="q-pt-none">
    <q-img class="rounded-borders" :src="getImageURL(item[type] as any)" />
  </q-card-section>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const { type, item } = defineProps<{
    type: any;
    item: CategoryTypes;
  }>();

  const { getImageURL } = useUtilities();
</script>
