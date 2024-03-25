<template>
  <div>
    <q-responsive :ratio="aspectRatio()">
      <q-skeleton height="566.55px" width="100%" />
    </q-responsive>
    <q-item class="q-ma-md q-pa-none">
      <q-skeleton height="125.6px" width="100%" />
    </q-item>
    <q-item class="q-px-md">
      <div class="row q-gutter-sm">
        <q-skeleton type="QChip" />
        <q-skeleton type="QChip" width="51.19px" /></div
    ></q-item>
    <q-item class="justify-center"><q-skeleton type="QChip" width="800px" /></q-item>

    <q-item class="row q-gutter-y-md">
      <div class="row wrap">
        <div
          v-for="index in 14"
          :key="index"
          class="column q-gutter-sm items-center q-mt-md"
          :class="{ 'col-4': $q.screen.lt.sm, 'col-3': !$q.screen.lt.sm }"
        >
          <q-skeleton type="circle" size="64px" />
          <q-skeleton type="text" width="74px" />
        </div>
      </div>
    </q-item>
  </div>
</template>

<script setup lang="ts">
  const { aspectRatio } = useUtilities();
</script>
