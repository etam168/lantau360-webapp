<template>
  <q-dialog ref="dialogRef">
    <q-card>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title
          ><span class="text-weight-bold">{{
            $t("notification.appinstalled")
          }}</span></q-toolbar-title
        >

        <q-btn flat round dense icon="fa-solid fa-xmark" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <div>
          {{
            "The app is installed. Please close the browser session and use the app from your home screen."
          }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  const { dialogRef } = useDialogPluginComponent();
</script>
