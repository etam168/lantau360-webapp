<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-layout view="lHh lpr lFf" style="max-width: 1024px">
      <q-page-container>
        <q-page class="column items-center justify-center">
          <q-card class="my-card">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">Please login to procceed</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat v-close-popup>Cancel</q-btn>
              <q-btn flat @click="handleLogin('login')">Login</q-btn>
            </q-card-actions>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { defineAsyncComponent, onMounted, ref } from "vue";
  import { useDialogPluginComponent, useQuasar } from "quasar";
  import eventBus from "@/utils/event-bus";

  const $q = useQuasar();
  const isDialogVisible = ref();
  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

  onMounted(() => {
    eventBus.on("ConfirmDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "ConfirmDialog");
  }

  function handleLogin(tabValue: string) {
    onDialogCancel();
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        tabValue: tabValue
      }
    });
  }
</script>

<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
