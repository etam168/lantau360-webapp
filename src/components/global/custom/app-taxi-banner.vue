<template>
  <q-card flat bordered class="q-ma-md bg-grey-3">
    <q-item dense>
      <q-item-section thumbnail class="q-pl-xs" style="width: 48px">
        <q-avatar>
          <q-icon :name="fasCircleInfo" color="primary" size="sm" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label v-if="isCallTaxi"
          >Call Taxi <span class="text-primary">Your Ride, Your Way</span> operating in Lantau
          Island</q-item-label
        >
        <q-item-label v-else>
          Here is our collection of <span class="text-primary">Blue Taxis</span> operating in Lantau
          Island</q-item-label
        >
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
  import { fasCircleInfo } from "@quasar/extras/fontawesome-v6";

  // Props
  const { isCallTaxi } = defineProps<{
    isCallTaxi: boolean;
  }>();
</script>
