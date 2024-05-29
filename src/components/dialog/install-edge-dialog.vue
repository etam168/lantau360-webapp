<template>
  <q-dialog ref="dialogRef">
    <q-card>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title
          ><span class="text-weight-bold">{{
            $t("notification.installApp")
          }}</span></q-toolbar-title
        >

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <div>
          {{ "Follow the instructions to install the app on Edge." }}
        </div>
      </q-card-section>

      <q-card-section>
        <img :src="PLATFORM.FIREFOX" alt="Install Image" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { PLATFORM } from "@/constants";

  const { dialogRef } = useDialogPluginComponent();
</script>
