<template>
  <q-dialog position="bottom" persistent>
    <q-card
      style="
        width: 350px;
        border: 2px solid #00652e;
        border-top-left-radius: 25px;
        border-top-right-radius: 25px;
      "
    >
      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold">{{ $t("installApp.title") }}</div>
        </div>

        <q-space />

        <q-btn flat round icon="done" @click="showIosInstallationGuide" />
        <q-btn flat round icon="close" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  // import { useI18n } from "vue-i18n";
  // import { useQuasar } from "quasar";

  // const { t } = useI18n();
  // const $q = useQuasar();

  // const handleDone = () => {
  //   $q.dialog({
  //     message: t("installApp.instructions")
  //   });
  // };

  const showIosInstallationGuide = () => {
    // remove following line if you want to show the banner after installation
    // showIosInstallPrompt.value = false;
    alert(
      'To install this app on device:\n\n1. Tap the "Share" button (usually located at the bottom of the screen).\n\n2. Scroll down and find the "Add to Home Screen" option.\n\n3. Tap "Add" in the upper-right corner.\n\nNow, you can access the app from your home screen!'
    );
  };
</script>

<style scoped>
  .install-card {
    width: 350px;
    border: 2px solid #00652e;
    border-radius: 25px 25px 0 0;
  }
</style>
