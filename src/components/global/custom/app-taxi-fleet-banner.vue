<template>
  <q-banner class="q-ma-md shadow-1" rounded elevated>
    <template v-slot:avatar>
      <q-btn
        round
        unelevated
        :icon="fasCircleInfo"
        size="md"
        class="q-mr-md text-primary"
        @click="showInfo"
      >
        <q-tooltip>Click for more information</q-tooltip>
      </q-btn>
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
