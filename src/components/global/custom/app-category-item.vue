<template>
  <q-item clickable class="full-width" @click="$emit('click')">
    <q-item-section avatar>
      <app-avatar-rounded :image-path="imagePath" size="54px" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ line1 }}</q-item-label>
      <q-item-label caption>{{ line2 }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  // Props
  const { imagePath, line1, line2 } = defineProps<{
    imagePath: string;
    line1: string;
    line2: string;
  }>();

  defineEmits<{
    (e: "click"): void;
  }>();
</script>
