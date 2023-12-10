<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" style="max-width: 1024px">
      <q-page-container class="bg-image">
        <q-page class="column items-end justify-center">
          <!-- card section -->
          <q-card class="bg-secondary q-pt-none q-pa-lg q-mr-xl" :style="authStyle">
            <q-card-section align="center" class="q-pa-none">
              <q-avatar size="128px" square> <q-img :src="logo" /></q-avatar>
            </q-card-section>

            <!-- login and Registration -->
            <!-- <router-view></router-view> -->
            <Login @close-dialog="closeDialog" />
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed, ref } from "vue";

  // 3rd Party Import
  import { useDialogPluginComponent, useQuasar } from "quasar";
  import Login from "./login.vue";
  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

  const $q = useQuasar();
  const logo = ref("/img/logo/logo.png");
  const isDialogVisible = ref();

  const authStyle = computed(() =>
    $q.screen.lt.sm ? { width: "100vw", opacity: "100%" } : { width: "480px", opacity: "90%" }
  );

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
  }
  const closeDialog = () => {
    setTimeout(() => {
      onDialogCancel();
    }, 1200);
  };
</script>

<style scoped>
  .bg-image {
    background: url("@/assets/img/logon-bg-lantau.jpg");
    background-size: cover;
    background-position: center center;
  }
</style>
