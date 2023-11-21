<template>
  <vee-form :validation-schema="schema" @submit="onOKClick" v-slot="{ meta }">
    <q-card flat>
      <q-scroll-area style="height: calc(100vh - 250px)" class="q-ma-none q-pr-lg">
        <posting-content :directory="directory" />
      </q-scroll-area>
    </q-card>

    <q-stepper-navigation>
      <app-button
        color="green"
        :label="$t('action.continue')"
        :disabled="dummy(meta)"
        type="submit"
        v-model="isDisabled"
      ></app-button>
    </q-stepper-navigation>
  </vee-form>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent, PropType, ref } from "vue";
  import { useI18n } from "vue-i18n";

  // 3rd Party Modules
  import * as yup from "yup";

  // .ts file
  import { Directory } from "@/interfaces/directory";

  export default defineComponent({
    name: "InputDialogStep1",

    props: {
      directory: {
        type: Array as PropType<Directory[]>
      }
    },

    components: {
      AppButton: defineAsyncComponent(() => import("@/components/widgets/app-button.vue")),
      PostingContent: defineAsyncComponent(() => import("./posting-content.vue"))
    },

    setup(_, { emit }) {
      const { t } = useI18n({ useScope: "global" });

      const schema = yup.object({
        postingName: yup.string().required().min(3).label(t("posting.columns.postingName")),
        title: yup.string().required().min(3).label(t("posting.columns.title")),
        subtitle1: yup.string().required().nullable().min(3).label(t("posting.columns.subtitle1")),
        latitude: yup.number().typeError(t("errors.required.latitude")).required().min(-90).max(90),
        longitude: yup
          .number()
          .typeError(t("errors.required.longitude"))
          .required()
          .min(-180)
          .max(180)
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

      return {
        dummy,
        isDisabled,
        schema,
        onOKClick
      };
    }
  });
</script>
