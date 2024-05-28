<template>
  <q-dialog ref="dialogRef" position="bottom" persistent>
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
          <q-img :src="IMAGES.LOGO" />
        </div>
        <div>
          <div class="text-weight-bold">{{ $t("installApp.title") }}</div>
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn flat round icon="done" @click="showIosInstallationGuide" />
        <q-btn flat round icon="close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { IMAGES } from "@/constants";
  import { useQuasar } from "quasar";
  const $q = useQuasar();
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
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
    onDialogCancel();
    notifyPrompt();
  };

  const notifyPrompt = () => {
    $q.notify({
      message: `
      <div>To install this app on your device:</div>
      <ol>
        <li>Tap the <strong>Share</strong> button (usually located at the bottom of the screen).</li>
        <li>Scroll down and find the <strong>Add to Home Screen</strong> option.</li>
        <li>Tap <strong>Add</strong> in the upper-right corner.</li>
      </ol>
      <div>Now, you can access the app from your home screen!</div>
    `,
      multiLine: true,
      html: true,
      color: "primary",
      position: "top",
      timeout: 0,
      avatar: IMAGES.LOGO,
      badgePosition: "top-right",
      actions: [
        {
          label: "Dismiss",
          color: "white",
          handler: () => {
            /* console.log('wooow') */
          }
        }
      ]
    });
  };
</script>

<style scoped>
  .install-card {
    width: 350px;
    border: 2px solid #00652e;
    border-radius: 25px 25px 0 0;
  }
</style>
