<template>
    <q-card v-if="browserType !== 'unknow'">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-weight-bold">
          {{ $t("notification.installApp") }}
        </q-toolbar-title>

        <q-btn flat round dense :icon="fasXmark" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <div>
          {{ "Follow the instructions to install the app" }}
        </div>
      </q-card-section>

      <q-card-section>
        <img :src="platformIcon" alt="Install Image" />
      </q-card-section>
    </q-card>
    <install-complete-section v-else />
</template>

<script setup lang="ts">
  // Quasar Import
  import { Platform } from "quasar";

  import { PLATFORM } from "@/constants";
  import { fasXmark } from "@quasar/extras/fontawesome-v6";

  import InstallCompleteSection from "./sections/install-complete-section.vue";

  const browserType = computed(() => {
    if (Platform.is.edge) return "edge";
    if (Platform.is.ios) return "ios";
    if (Platform.is.opera) return "opera";
    return "unknow";
  });

  const platformIcon = computed(() => {
    switch (browserType.value) {
      case "edge":
        return PLATFORM.FIREFOX; //To do need edge resource
      case "ios":
        return PLATFORM.IOS;
      case "opera":
        return PLATFORM.OPERA;
      default:
        return PLATFORM.FIREFOX; // Default fallback icon
    }
  });
</script>
