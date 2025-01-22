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
      <language-select v-if="type === 'language'" />
      <app-button-flat
        v-else-if="type === 'moreItem'"
        round
        :loading="isLoading"
        :icon="fasAngleRight"
        @click="handleClick"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { fasAngleRight } from "@quasar/extras/fontawesome-v6";
  const emit = defineEmits(["on-item-click"]);

  const {
    icon,
    title = "",
    type
  } = defineProps<{
    icon?: string;
    title?: string;
    type?: string;
  }>();

  const isLoading = ref(false);

  const handleClick = () => {
    isLoading.value = true;
    emit("on-item-click");
  };

  const resetLoading = () => {
    isLoading.value = false;
  };

  defineExpose({ resetLoading });
</script>
