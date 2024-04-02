<template>
  <div>You should login first</div>
  <q-btn @click="showLoginDialog">Login</q-btn>
</template>
<script setup lang="ts">
  import { useQuasar } from "quasar";

  const $q = useQuasar();

  function showLoginDialog() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        callback: openCheckInDialog
      }
    });
  }
</script>
