<template>
  <q-card-actions align="center" class="q-pa-none">
    <q-toolbar class="bg-white shadow-1" style="max-width: 1024px">
      <q-btn dense flat round :icon="fasArrowLeft" v-close-popup @click="emitCloseEvent"></q-btn>

      <q-toolbar-title class="text-center text-weight-medium">
        <slot></slot>
        <!-- Default slot for content -->
      </q-toolbar-title>

      <q-btn flat></q-btn>
    </q-toolbar>
  </q-card-actions>
</template>

<script setup lang="ts">
  import { fasArrowLeft } from "@quasar/extras/fontawesome-v6";
  import { defineEmits } from "vue";

  const emit = defineEmits(["dialogClosed"]);

  const emitCloseEvent = () => {
    emit("dialogClosed");
  };
</script>
