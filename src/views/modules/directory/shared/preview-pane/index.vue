<template>
  <q-card flat class="my-card bg-white">
    <q-toolbar>
      <q-toolbar-title>Preview</q-toolbar-title>
    </q-toolbar>

    <q-separator />

    <q-card-section style="max-width: 800px" class="q-pa-sm">
      <!-- <q-card-section :horizontal="$q.screen.gt.md"> -->
      <q-card-section>
        <directory-image-path :imagePath="imagePath" />
      </q-card-section>

      <q-card-section>
        <directory-info />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { inject, Ref } from "vue";

  // Custom Components
  import DirectoryImagePath from "./directory-image-path.vue";
  import DirectoryInfo from "./directory-info.vue";

  const imagePath = inject("imagePath") as Ref<any>;
</script>
