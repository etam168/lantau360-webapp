<template>
  <q-card flat :style="$q.screen.gt.sm ? Screen.laptopMaxWidth : Screen.tabletMaxWidth">
    <editor-input />

    <q-stepper-navigation>
      <app-button
        color="green"
        :label="$t('action.continue')"
        type="submit"
        @click="onOKClick"
      ></app-button>
      <app-button flat color="primary" @click="handleBack" :label="$t('action.back')" />
    </q-stepper-navigation>
  </q-card>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent } from "vue";

  // .ts files
  import usePostingInput from "../use-posting-input";
  import { Screen } from "@/constants";

  export default defineComponent({
    name: "InputDialogStep1",

    components: {
      AppButton: defineAsyncComponent(() => import("@/components/widgets/app-button.vue")),
      EditorInput: defineAsyncComponent(() => import("./editor-input.vue"))
    },

    setup(_, { emit }) {
      const { postingInput } = usePostingInput();

      function onOKClick() {
        emit("move-next");
      }

      function handleBack() {
        emit("move-back", postingInput.value);
      }

      return {
        postingInput,
        handleBack,
        onOKClick,
        Screen
      };
    }
  });
</script>
