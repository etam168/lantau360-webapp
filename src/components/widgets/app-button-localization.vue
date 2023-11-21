<template>
  <q-btn flat no-caps v-bind="$attrs" @click="toggleLanguage">
    {{ t("language.name") }}
    <q-tooltip class="bg-dark text-caption shadow-4"
      >Change Language to {{ t("language.name") }}</q-tooltip
    >
  </q-btn>
</template>

<script setup lang="ts">
  import { useI18n } from "vue-i18n";

  const { t, locale } = useI18n({ useScope: "global" });

  function toggleLanguage() {
    const newLocale = locale.value == "en" ? "hk" : "en";
    locale.value = newLocale;
    localStorage.setItem("locale", locale.value as string);
  }
</script>
