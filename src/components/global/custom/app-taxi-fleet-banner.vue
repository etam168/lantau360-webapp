<template>
  <q-card flat bordered class="q-ma-md">
    <q-item dense>
      <q-item-section thumbnail class="bg-transparent q-pl-sm">
        <q-avatar>
          <q-icon :name="fasCircleInfo" color="primary" size="sm" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>
          Here is our collection of <span class="text-primary">Blue Taxis</span> operating in Lantau
          Island</q-item-label
        >
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
  import { fasCircleInfo } from "@quasar/extras/fontawesome-v6";
</script>
