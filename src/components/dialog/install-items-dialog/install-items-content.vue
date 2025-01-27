<template>
  <template v-for="(item, index) in renderItems" :key="index">
    <q-card v-if="item.type === 'edge'">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-weight-bold">
          {{ $t("notification.installApp") }}
        </q-toolbar-title>

        <q-btn flat round dense :icon="fasXmark" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <div>
          {{ "Follow the instructions to install the app on Edge." }}
        </div>
      </q-card-section>

      <q-card-section>
        <img :src="PLATFORM.FIREFOX" alt="Install Image" />
      </q-card-section>
    </q-card>

    <!-- <install-edge-section v-if="item.type === 'edge'" /> -->
    <install-ios-section v-else-if="item.type === 'ios'" />
    <install-opera-section v-else-if="item.type === 'opera'" />
    <install-complete-section v-else />
  </template>
</template>

<script setup lang="ts">
  // Quasar Import
  import { Platform } from "quasar";

  import { PLATFORM } from "@/constants";
  import { fasXmark } from "@quasar/extras/fontawesome-v6";

  import InstallCompleteSection from "./sections/install-complete-section.vue";
  // import InstallEdgeSection from "./sections/install-edge-section.vue";
  import InstallIosSection from "./sections/install-ios-section.vue";
  import InstallOperaSection from "./sections/install-opera-section.vue";

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
