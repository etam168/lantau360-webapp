<template>
  <q-dialog ref="dialogRef" position="bottom">
    <q-card class="install-card">
      <q-card-section class="row items-center no-wrap">
        <div class="text-weight-bold">{{ $t("notification.installApp") }}</div>
        <q-space />
        <q-btn flat round icon="done" @click="handleDone" />
        <q-btn flat round icon="close" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useDialogPluginComponent } from "quasar";
  // import { useI18n } from "vue-i18n";

  // const { t } = useI18n();
  const props = defineProps<{ deferredPrompt: any }>();
  const localDeferredPrompt = ref(props.deferredPrompt);
  const { dialogRef } = useDialogPluginComponent();

  const handleDone = () => {
    if (localDeferredPrompt.value) {
      localDeferredPrompt.value.prompt();
      localDeferredPrompt.value.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          notify("User accepted the A2HS prompt", "negative");
        } else {
          notify("User dismissed the A2HS prompt", "negative");
        }
        localDeferredPrompt.value = null;
      });
    }
  };
</script>

<style scoped>
  .install-card {
    width: 350px;
    border: 2px solid #00652e;
    border-bottom: 0;
    border-radius: 25px 25px 0 0;
  }
</style>
