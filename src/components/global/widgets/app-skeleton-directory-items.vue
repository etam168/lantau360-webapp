<template>
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
</template>

<script setup lang="ts">
  const { itemCount = 1 } = defineProps<{
    itemCount?: number;
  }>();
</script>
