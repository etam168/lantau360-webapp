<template>
  <q-card class="q-ma-md col" style="min-height: 720px">
    <user-avartar @update-avatar="handleUpdateAvatar" />
    <q-separator inset />

    <user-preference
      @update-language="handleUpdateLanguage"
      @update-period="handleRetentionPeriod"
    />
    <q-separator inset />

    <change-password />
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { provide, ref } from "vue";
  import axios, { AxiosError } from "axios";

  // Components
  import UserAvartar from "./section/user-avatar.vue";
  import UserPreference from "./section/user-preference.vue";
  import ChangePassword from "./section/change-password.vue";

  // .ts files
  import { useUserData } from "./use-user-data";
  import { Staff } from "@/interfaces/models/entities/staff";

  const {
    staffInput,
    STAFF_URL,
    contentInput,
    resetUser,
    handleRetentionPeriod,
    handleUpdateAvatar,
    handleUpdateLanguage
  } = useUserData();

  const error = ref<string | null>(null);

  provide("settingsContent", contentInput);

  try {
    resetUser();

    const [rUser] = await Promise.all([axios.get<Staff>(STAFF_URL)]);
    staffInput.value = rUser.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.status === 404) {
        error.value = "Not found";
      } else {
        error.value = "An error occurred";
      }
    } else {
      error.value = "An unexpected error occurred";
    }
  }
</script>
