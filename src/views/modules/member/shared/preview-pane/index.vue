<template>
  <q-card flat class="my-card bg-white">
    <q-toolbar>
      <q-toolbar-title>Preview</q-toolbar-title>
    </q-toolbar>

    <q-separator />

    <q-card-section style="max-width: 800px" class="q-pa-sm">
      <!-- <q-card-section :horizontal="$q.screen.gt.md"> -->
      <q-card-section>
        <!-- <floor-plan-image :imagePath="imagePath" /> -->
      </q-card-section>

      <q-card-section>
        <member-info />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Custom Components
  //import FloorPlanImage from "./floor-plan-image.vue";
  import MemberInfo from "./member-info.vue";

  //const imagePath = inject("imagePath") as Ref<any>;
</script>
