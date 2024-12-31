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
  import { fasPlus } from "@quasar/extras/fontawesome-v6";

  // Props
  const { createTitle, createDescription } = defineProps<{
    createTitle: string;
    createDescription: string;
  }>();

  // Emits
  const emit = defineEmits(["on-create-posting"]);

  function onCreatePosting() {
    emit("on-create-posting");
  }
</script>
