<!-- language-select.vue -->
<template>
  <q-btn-dropdown
    unelevated
    rounded
    outline
    split
    padding="1px"
    size="sm"
    style="overflow: hidden; width: 108px"
    :dropdown-icon="fasChevronDown"
  >
    <template v-slot:label>
      <div class="text-caption">
        {{ selectedLanguageLabel }}
      </div>
    </template>

    <q-list>
      <q-item
        v-for="option in languageOptions"
        :key="option.value"
        clickable
        v-close-popup
        @click="changeLanguage(option.value)"
      >
        <q-item-section>
          <q-item-label>{{ option.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
  import { fasChevronDown } from "@quasar/extras/fontawesome-v6";

  const { locale } = useI18n({ useScope: "global" });

  const languageOptions = [
    { label: "English", value: "en" },
    { label: "繁體中文", value: "hk" },
    { label: "简体中文", value: "cn" }
  ];

  const selectedLanguageLabel = computed(() => {
    const language = languageOptions.find(option => option.value === locale.value);
    return language ? language.label : "";
  });

  const changeLanguage = (language: string) => {
    locale.value = language;
  };

  watch(locale, (value: any) => {
    localStorage.setItem("locale", value);
  });
</script>
