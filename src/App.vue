<template>
  <router-view />
  <!-- <AddToHomeScreen /> -->
  <div v-show="showInstallPrompt" class="install-banner" @click="showInstallationGuide">
    Install App
  </div>
</template>

<script setup lang="ts">
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };
  const isInStandaloneMode = () => "standalone" in window.navigator && window.navigator.standalone;

  const showInstallPrompt = ref(isIos() && !isInStandaloneMode());

  const showInstallationGuide = () => {
    // remove following line if you want to show the banner after installation
    showInstallPrompt.value = false;
    alert(
      'To install this app on device:\n\n1. Tap the "Share" button (usually located at the bottom of the screen).\n\n2. Scroll down and find the "Add to Home Screen" option.\n\n3. Tap "Add" in the upper-right corner.\n\nNow, you can access the app from your home screen!'
    );
  };
</script>

<style>
  input {
    background-clip: text !important;
    -webkit-background-clip: text !important;
  }
  .install-banner {
    position: fixed;
    bottom: 16px;
    right: 16px;
    background-color: #007bff;
    color: #fff;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font: 12px sans-serif;
  }
</style>
