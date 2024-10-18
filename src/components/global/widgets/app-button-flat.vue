<template>
  <q-btn v-bind="$attrs" color="primary" dense flat>
    <template #default>
      <slot></slot>
    </template>
  </q-btn>
</template>

<script setup lang="ts"></script>
