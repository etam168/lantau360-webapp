<template>
  <q-card>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title class="text-weight-bold">
        {{ titleText }}
      </q-toolbar-title>

      <q-btn flat round dense :icon="fasXmark" v-close-popup />
    </q-toolbar>

    <q-card-section>
      <div>
        {{ contentText }}
      </div>
      <img v-if="browserType !== 'unknow'" :src="platformIcon" alt="Install Image" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Quasar Import
  import { Platform } from "quasar";

  import { PLATFORM } from "@/constants";
  import { fasXmark } from "@quasar/extras/fontawesome-v6";

  const { t } = useI18n({ useScope: "global" });

  const browserType = computed(() => {
    if (Platform.is.edge) return "edge";
    if (Platform.is.ios) return "ios";
    if (Platform.is.opera) return "opera";
    return "unknow";
  });

  const titleText = computed(() => {
    return browserType.value !== "unknow"
      ? t("notification.installApp")
      : t("notification.appinstalled");
  });

  const contentText = computed(() => {
    return browserType.value !== "unknow"
      ? t("notification.followInstructions")
      : t("notification.appAlreadyInstalled");
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
