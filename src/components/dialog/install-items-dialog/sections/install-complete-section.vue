<template>
  <q-card>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title
        ><span class="text-weight-bold">{{
          $t("notification.appinstalled")
        }}</span></q-toolbar-title
      >

      <q-btn flat round dense :icon="fasXmark" v-close-popup />
    </q-toolbar>

    <q-card-section>
      <div>
        {{
          "The app is installed. Please close the browser session and use the app from your home screen."
        }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { fasXmark } from "@quasar/extras/fontawesome-v6";
</script>
