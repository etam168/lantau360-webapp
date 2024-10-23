<template>
  <div>
    <q-btn v-bind="$attrs" color="primary" dense flat no-caps size="12px" :ripple="false">
      <template #default>
        <slot></slot>
      </template>
    </q-btn>
  </div>
</template>

<script setup lang="ts"></script>
