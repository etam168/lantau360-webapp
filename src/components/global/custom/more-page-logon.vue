<template>
  <q-card-actions align="right">
    <q-chip clickable @click="handleAuthDialog('login')" outline color="primary" text-color="white">
      {{ $t(`${i18nKey}.button.login`) }}
    </q-chip>

    <q-chip clickable @click="handleAuthDialog('register')" color="primary" text-color="white">
      {{ $t(`${i18nKey}.button.joinNow`) }}
    </q-chip>
  </q-card-actions>
</template>

<script setup lang="ts">
  const emit = defineEmits(["on-auth-dialog"]);

  const i18nKey = "auth";

  const handleAuthDialog = (mode: string) => {
    emit("on-auth-dialog", mode);
  };
</script>
