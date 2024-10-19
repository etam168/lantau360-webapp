<template>
  <template v-for="(item, index) in renderItems" :key="index">
    <install-edge-section v-if="item.type === 'edge'" />
    <install-ios-section v-else-if="item.type === 'ios'" />
    <install-opera-section v-else-if="item.type === 'opera'" />
    <install-complete-section v-else />
  </template>
</template>
<script setup lang="ts">
  import InstallCompleteSection from "./sections/install-complete-section.vue";
  import InstallEdgeSection from "./sections/install-edge-section.vue";
  import InstallIosSection from "./sections/install-ios-section.vue";
  import InstallOperaSection from "./sections/install-opera-section.vue";
  import { Platform } from "quasar";

  interface RenderItem {
    name: string;
    type: "edge" | "ios" | "opera";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (true) {
      case Platform.is.edge:
        return [{ name: "edge", type: "edge" }];
      case Platform.is.ios:
        return [{ name: "ios", type: "ios" }];
      case Platform.is.opera:
        return [{ name: "opera", type: "opera" }];
      default:
        return [{ name: "opera", type: "opera" }];
      // To be implemented: Handle unknown browsers with a generic message or action
    }
  });
</script>
