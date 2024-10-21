<template>
  <q-card-actions align="right">
    <q-chip clickable @click="handleAuthDialog('login')" outline color="primary" text-color="white">
      {{ $t("auth.login.button") }}
    </q-chip>
    <q-chip clickable @click="handleAuthDialog('register')" color="primary" text-color="white">
      {{ $t("auth.register.joinNow") }}
    </q-chip>
  </q-card-actions>
</template>

<script setup lang="ts">
  const emit = defineEmits(["on-auth-dialog"]);

  const handleAuthDialog = (mode: string) => {
    emit("on-auth-dialog", mode);
  };
</script>
