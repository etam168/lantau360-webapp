<template>
  <div class="q-pa-sm q-mt-none">
    <div class="row q-col-gutter-sm">
      <div v-for="index in itemCount" :key="index" class="col-md-3 col-sm-4 col-6 my-card">
        <q-card>
          <q-responsive :ratio="11 / 8">
            <q-skeleton height="170px" square animation="fade" />
          </q-responsive>

          <div class="row items-center q-pa-md">
            <q-skeleton type="text" width="40%" />
          </div>

          <div class="q-pa-sm"><q-skeleton type="QBtn" bordered width="100%" /></div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { itemCount = 1 } = defineProps<{
    itemCount?: number;
  }>();
</script>
