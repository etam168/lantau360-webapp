<template>
  <q-card-actions align="center" class="q-pa-none">
    <q-toolbar class="bg-white shadow-1" style="max-width: 1024px">
      <q-btn dense flat round icon="arrow_back" v-close-popup></q-btn>

      <q-toolbar-title class="text-center text-weight-medium">
        <slot></slot>
        <!-- Default slot for content -->
      </q-toolbar-title>

      <q-btn flat></q-btn>
    </q-toolbar>
  </q-card-actions>
</template>

<script setup lang="ts"></script>
