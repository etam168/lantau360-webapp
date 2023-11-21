<template>
  <q-list>
    <q-item dense class="q-pa-none">
      <q-item-section>
        <q-item-label>
          {{ created.ca }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense class="q-pa-none">
      <q-item-section>
        <q-item-label> By: {{ created.cb }} </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  defineProps({
    created: {
      type: Object,
      required: true
    }
  });
</script>
