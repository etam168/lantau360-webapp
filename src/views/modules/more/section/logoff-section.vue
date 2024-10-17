<template>
  <q-card-section>
    <q-item-section class="q-mb-md q-pl-sm"> </q-item-section>
    <q-item-section side>
      <div class="text-grey-8 q-gutter-xs">
        <q-chip
          clickable
          @click="showLoginDialog('login')"
          outline
          color="primary"
          text-color="white"
        >
          {{ $t("auth.login.button") }}
        </q-chip>
        <q-chip
          clickable
          @click="showLoginDialog('register')"
          color="primary"
          text-color="white"
        >
          {{ $t("auth.register.joinNow") }}
        </q-chip>
      </div>
    </q-item-section>
  </q-card-section>
</template>

<script setup lang="ts">
  const emit = defineEmits(["on-dialog"]);

  const showLoginDialog = (mode: string) => {
    emit("on-dialog", mode);
  };
</script>
