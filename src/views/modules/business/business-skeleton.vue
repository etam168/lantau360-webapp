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

    <div class="q-pa-sm">
      <div class="row q-col-gutter-sm">
        <div v-for="(item, index) in 5" :key="index" class="col-md-3 col-sm-4 col-6">
          <q-card class="my-card">
            <q-responsive :ratio="11 / 8">
              <q-skeleton height="170px" square animation="fade" />
            </q-responsive>

            <div class="row items-center q-pa-sm">
              <q-icon name="location_on" color="grey-4" class="q-mr-sm" size="xs" />
              <q-skeleton type="text" width="40%" />
            </div>

            <div class="q-pa-sm"><q-skeleton type="QBtn" bordered width="100%" /></div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { aspectRatio, isSmallScreen } = useUtilities();
  //const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));
</script>
