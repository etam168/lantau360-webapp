<template>
  <q-card class="install-card">
    <q-card-section class="row items-center no-wrap">
      <div class="text-weight-bold">{{ $t("installApp.title") }}</div>
      <q-space />
      <q-btn flat round icon="done" @click="handleDone" />
      <q-btn flat round icon="close" v-close-popup />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // import { useI18n } from "vue-i18n";

  // const { t } = useI18n();
  const props = defineProps<{ deferredPrompt: any }>();

  const handleDone = () => {
    if (props.deferredPrompt) {
      props.deferredPrompt.prompt();
      props.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        props.deferredPrompt = null;
      });
    }
  };
</script>

<style scoped>
  .install-card {
    width: 350px;
    border: 2px solid #00652e;
    border-radius: 25px 25px 0 0;
  }
</style>
