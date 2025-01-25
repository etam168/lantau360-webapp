<template>
  <q-bar dense class="bg-transparent">
    <q-space />

    <q-btn :icon="fasXmark" flat round size="sm" v-close-popup @click="emitCloseEvent" />
  </q-bar>
</template>

<script setup lang="ts">
  import { fasXmark } from "@quasar/extras/fontawesome-v6";
  const emit = defineEmits(["dialogClosed"]);

  const emitCloseEvent = () => {
    emit("dialogClosed");
  };
</script>
