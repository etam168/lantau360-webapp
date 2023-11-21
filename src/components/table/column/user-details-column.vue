<template>
  <q-list>
    <q-item dense class="q-pa-none">
      <q-item-section>
        <q-item-label> Email: {{ emailAndName.email }} </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense class="q-pa-none">
      <q-item-section>
        <q-item-label> Name: {{ emailAndName.name }} </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  defineProps({
    emailAndName: {
      type: Object,
      required: true
    }
  });
</script>
