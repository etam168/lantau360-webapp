<template>
  <q-item class="q-pa-none">
    <q-item-section top>
      <q-item-label lines="1" :style="{ width: colWidth || 'auto' }">
        {{ title }}
      </q-item-label>
      <q-item-label>
        <q-chip
          v-for="chip in checkBits(listingMode)"
          :key="chip.label"
          :label="chip.label"
          :color="chip.color"
          text-color="white"
          dense
        />
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  defineProps({
    title: {
      type: String,
      required: true
    },
    listingMode: {
      type: Number,
      required: true
    },
    colWidth: {
      type: String,
      default: ""
    }
  });

  function checkBits(num: number): { color: string; label: string }[] {
    const bits: { color: string; label: string }[] = [];

    // Check if 3rd bit is on, push "Feature" label if true
    num & (1 << 2) ? bits.push({ color: "green-9", label: "Feature" }) : null;

    // Check if 4th bit is on, push "Hero" label if true
    num & (1 << 3) ? bits.push({ color: "warning", label: "Hero" }) : null;

    return bits;
  }
</script>
