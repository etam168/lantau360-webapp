<template>
  <q-option-group
    v-model="locale"
    :options="languageOption"
    color="green"
    inline
    @update:model-value="changeLang"
  />
  <q-option-group
    v-show="false"
    v-model="locale"
    :options="languageOption"
    color="green"
    inline
    @update:model-value="changeLang"
  />
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from "vue";

  export default defineComponent({
    name: "AppOptionMetaLocalization",

    emit: ["update:modelValue"],

    setup(_, ctx) {
      const locale = ref("hk");
      // const $q = useQuasar();

      const languageOption = computed(() => [
        { label: "hk", value: "hk" },
        { label: "zh", value: "zh" }
      ]);

      function changeLang(locale: string) {
        ctx.emit("update:modelValue", locale);
        //return locale;
      }

      return {
        locale,
        languageOption,
        changeLang
      };
    }
  });
</script>
