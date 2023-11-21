<!-- chinese-name-column.vue -->
<template>
  <q-list>
    <q-item dense class="q-pa-none">
      <q-item-section>
        <q-item-label>
          <q-chip dense text-color="white" class="bg-green-9">繁</q-chip>
          {{ chineseName.hk }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item dense class="q-pa-none">
      <q-item-section>
        <q-item-label>
          <q-chip dense text-color="white" class="bg-warning">简</q-chip>
          {{ chineseName.cn }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  defineProps({
    chineseName: {
      type: Object,
      required: true
    }
  });
</script>
