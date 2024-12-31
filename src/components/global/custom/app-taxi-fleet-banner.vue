<template>
  <q-banner class="q-ma-md" rounded dense style="border: 1px solid rgba(0, 0, 0, 0.2)">
    <template v-slot:avatar>
      <q-icon :name="fasCircleInfo" color="primary" size="xs" />
    </template>
    Here is our collection of <span class="text-primary">Blue Taxis</span> operating in Lantau
    Island
  </q-banner>
</template>

<script setup lang="ts">
  import { fasCircleInfo } from "@quasar/extras/fontawesome-v6";

  // Emits
  const emits = defineEmits(["show-info"]);

  function showInfo() {
    emits("show-info");
  }
</script>
