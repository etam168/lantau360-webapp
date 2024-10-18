<!-- app-more-item.vue -->
<template>
  <q-item class="shadow-1 q-mb-md">
    <q-item-section avatar>
      <q-avatar size="36px" square>
        <img :src="icon" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-subtitle1 text-weight-medium">
        {{ $t(title) }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <app-button-flat round icon="fa-solid fa-angle-right" @click="$emit('on-item-click')" />
      <!-- <q-btn
        dense
        flat
        round
        icon="fa-solid fa-angle-right"
        @click="$emit('on-item-click')"
        v-close-popup
      ></q-btn> -->
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  const emit = defineEmits(["on-item-click"]);

  const { icon = "fa fa-house", title = "" } = defineProps<{
    icon?: string;
    title?: string;
  }>();
</script>
