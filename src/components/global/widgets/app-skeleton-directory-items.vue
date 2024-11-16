<template>
  <div class="row q-col-gutter-md q-mt-sm q-px-md">
    <div
      v-for="index in itemCount"
      :key="index"
      :class="$q.screen.lt.sm ? 'col-4' : 'col-3'"
      class="flex justify-center items-center"
    >
      <q-card flat>
        <q-card-section class="text-center">
          <q-skeleton type="circle" size="64px" />
          <q-skeleton type="text" width="64px" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { itemCount = 1 } = defineProps<{
    itemCount?: number;
  }>();
</script>
