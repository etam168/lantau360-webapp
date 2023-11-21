<template>
  <vee-form :validation-schema="schema" @submit="onOKClick" v-slot="{ meta }">
    <q-card flat style="height: calc(100vh - 250px)">
      <localization-input></localization-input>
    </q-card>

    <q-stepper-navigation>
      <app-button
        color="green"
        :label="$t('action.continue')"
        :disabled="dummy(meta)"
        type="submit"
        v-model="isDisabled"
      ></app-button>
      <app-button flat color="primary" @click="handleBack" :label="$t('action.back')" />
    </q-stepper-navigation>
  </vee-form>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent, ref } from "vue";

  // 3rd Party Modules
  import * as yup from "yup";

  // .ts files
  import usePostingInput from "../use-posting-input";

  export default defineComponent({
    name: "InputDialogStep1",

    components: {
      AppButton: defineAsyncComponent(() => import("@/components/widgets/app-button.vue")),
      LocalizationInput: defineAsyncComponent(() => import("./localization-input.vue"))
    },

    setup(_, { emit }) {
      const { postingInput } = usePostingInput();
      const postingTab = ref("posting-input");
      const visible = ref(false);
      const locale = ref("hk");

      const schema = yup.object({
        metaPostingName: yup.string().nullable().min(2).label("posting name"),
        metaTitle: yup.string().nullable().min(2).label("title"),
        metaSubTitle1: yup.string().nullable().min(2).label("subTitle")
      });

      const isDisabled = ref(false);

      function dummy(meta: any) {
        emit("is-disabled", isDisabled.value);
        if (!(meta.valid && meta.dirty)) {
          isDisabled.value = false;
          return true;
        } else {
          isDisabled.value = true;
          return false;
        }
      }

      function onOKClick() {
        emit("move-next");
      }

      function handleBack() {
        emit("move-back", postingInput.value);
      }

      return {
        dummy,
        isDisabled,
        schema,
        postingTab,
        postingInput,
        locale,
        visible,
        handleBack,
        onOKClick
      };
    }
  });
</script>
