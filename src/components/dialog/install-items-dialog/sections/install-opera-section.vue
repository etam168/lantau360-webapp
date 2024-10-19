<template>
  <q-card>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title
        ><span class="text-weight-bold">{{ $t("notification.installApp") }}</span></q-toolbar-title
      >

      <q-btn flat round dense :icon="fasXmark" v-close-popup />
    </q-toolbar>

    <q-card-section>
      <div>
        {{ "Follow the instructions to install the app on OPERA." }}
      </div>
    </q-card-section>

    <q-card-section>
      <img :src="PLATFORM.OPERA" alt="Install Image" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { fasXmark } from "@quasar/extras/fontawesome-v6";
  import { PLATFORM } from "@/constants";
</script>
