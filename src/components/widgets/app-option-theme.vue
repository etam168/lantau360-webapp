<template>
  <q-option-group
    :options="themeOptions"
    type="radio"
    v-model="theme"
    color="green"
    @update:model-value="changeTheme"
  />
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from "vue";

  import { useI18n } from "vue-i18n";
  import { useQuasar } from "quasar";

  export default defineComponent({
    name: "AppOptionTheme",

    setup() {
      const { t } = useI18n({ useScope: "global" });

      const $q = useQuasar();
      const theme = ref("light");

      const themeOptions = computed(() => [
        { label: t("settings.dark"), value: "dark" },
        { label: t("settings.light"), value: "light" }
      ]);

      function changeTheme(theme: string) {
        $q.dark.set(theme == "dark");
      }

      return {
        theme,
        themeOptions,

        changeTheme
      };
    }
  });
</script>
