<template>
  <q-banner :inline-actions="!isSmallScreen">
    <q-toolbar-title :class="{ 'row justify-center': isSmallScreen }">
      <q-skeleton width="74px" type="text" />
    </q-toolbar-title>

    <template v-slot:action>
      <!-- Center the chips -->
      <q-toolbar v-bind="$attrs" class="q-gutter-x-sm" :class="tabSelectClass">
        <q-skeleton type="QChip" width="99.38px" />
        <q-skeleton type="QChip" width="141.14" />
      </q-toolbar>
    </template>
  </q-banner>
</template>

<script setup lang="ts">
  const { isSmallScreen } = useUtilities();
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));
</script>
