<template>
  <q-card-actions align="right">
    <q-chip clickable @click="showLoginDialog('login')" outline color="primary" text-color="white">
      {{ $t("auth.login.button") }}
    </q-chip>
    <q-chip clickable @click="showLoginDialog('register')" color="primary" text-color="white">
      {{ $t("auth.register.joinNow") }}
    </q-chip>
  </q-card-actions>
</template>

<script setup lang="ts">
  const emit = defineEmits(["on-dialog"]);

  const showLoginDialog = (mode: string) => {
    emit("on-dialog", mode);
  };
</script>
