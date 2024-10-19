<!-- more-page-item.vue -->
<template>
  <q-item class="shadow-1">
    <q-item-section avatar>
      <q-avatar square :icon font-size="36px"></q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-subtitle1 text-weight-medium">
        {{ $t(title) }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <app-button-flat round :icon="fasAngleRight" @click="$emit('on-item-click')" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { fasAngleRight } from "@quasar/extras/fontawesome-v6";
  const emit = defineEmits(["on-item-click"]);

  const { icon, title = "" } = defineProps<{
    icon?: string;
    title?: string;
  }>();
</script>
