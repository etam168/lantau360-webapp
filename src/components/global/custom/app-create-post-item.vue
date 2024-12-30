<template>
  <q-item clickable v-ripple @click="onCreatePosting">
    <q-item-section avatar>
      <q-avatar color="green-1" text-color="primary" :icon="fasPlus" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ createTitle }}</q-item-label>
      <q-item-label caption>{{ createDescription }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { fasPlus, fasTriangleExclamation } from "@quasar/extras/fontawesome-v6";

  // Props
  const { createTitle, createDescription, onCreatePosting } = defineProps<{
    createTitle: string;
    createDescription: string;
    onCreatePosting: () => void;
  }>();
</script>
