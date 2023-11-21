<template>
  <q-option-group :options="languageOptions" type="radio" v-model="locale" color="green" />
</template>

<script lang="ts">
  import { defineComponent, watch } from "vue";
  import { useI18n } from "vue-i18n";

  export default defineComponent({
    name: "AppOptionLocalization",

    setup() {
      const { locale } = useI18n({ useScope: "global" });
      const languageOptions = [
        { label: "EN", value: "en" },
        { label: "中文", value: "hk" }
      ];

      watch(locale, (value: string) => {
        localStorage.setItem("locale", value);
      });

      return {
        locale,
        languageOptions
      };
    }
  });
</script>
