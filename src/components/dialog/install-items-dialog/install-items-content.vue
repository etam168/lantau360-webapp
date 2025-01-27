<template>
  <q-card>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title class="text-weight-bold">
        {{
          browserType !== "unknow" ? $t("notification.installApp") : $t("notification.appinstalled")
        }}
      </q-toolbar-title>

      <q-btn flat round dense :icon="fasXmark" v-close-popup />
    </q-toolbar>

    <q-card-section v-if="browserType !== 'unknow'">
      <div>
        {{ "Follow the instructions to install the app" }}
      </div>
    </q-card-section>

    <q-card-section v-if="browserType !== 'unknow'">
      <img :src="platformIcon" alt="Install Image" />
    </q-card-section>

    <q-card-section v-else>
      <div>
        {{
          "The app is installed. Please close the browser session and use the app from your home screen."
        }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Quasar Import
  import { Platform } from "quasar";

  import { PLATFORM } from "@/constants";
  import { fasXmark } from "@quasar/extras/fontawesome-v6";

  const browserType = computed(() => {
    if (Platform.is.edge) return "edge";
    if (Platform.is.ios) return "ios";
    if (Platform.is.opera) return "opera";
    return "unknow";
  });

  const platformIcon = computed(() => {
    switch (browserType.value) {
      case "edge":
        return PLATFORM.FIREFOX;
      case "ios":
        return PLATFORM.IOS;
      case "opera":
        return PLATFORM.OPERA;
      default:
        return PLATFORM.FIREFOX;
    }
  });
</script>
