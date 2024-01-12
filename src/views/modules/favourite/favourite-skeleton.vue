<template>
  <div>
    <q-responsive :ratio="aspectRatio()">
      <q-skeleton />
    </q-responsive>

    <q-banner :inline-actions="!isSmallScreen">
      <q-toolbar-title :class="{ 'row justify-center': isSmallScreen }">
        <q-skeleton width="74px" type="text" />
      </q-toolbar-title>

      <template v-slot:action>
        <!-- Center the chips -->
        <q-toolbar v-bind="$attrs" class="q-gutter-x-sm" :class="tabSelectClass">
          <q-skeleton type="QChip" />
          <q-skeleton type="QChip" />
        </q-toolbar>
      </template>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
  const { aspectRatio, isSmallScreen } = useUtilities();
  //const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));
</script>
