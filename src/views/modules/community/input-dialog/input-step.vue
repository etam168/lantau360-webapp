<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="onOKClick"
    v-slot="{ meta, values }"
  >
    <q-card flat class="full-height q-pa-none" style="display: grid; grid-template-rows: 1fr auto">
      <q-scroll-area>
        <q-card-section class="q-py-none">
          <images-section />
          <input-content />
        </q-card-section>
      </q-scroll-area>

      <q-card-actions class="q-pa-md">
        <app-button
          color="primary"
          class="full-width"
          :label="$t('posting.dialoge.save')"
          type="submit"
        />
      </q-card-actions>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  import * as yup from "yup";
  import { useI18n } from "vue-i18n";
  import { Form } from "vee-validate";

  // Interface files
  import { PostingImages } from "@/interfaces/models/custom-models/gallery";

  // .ts files
  import { usePostingInput } from "../shared/use-posting-input";

  // Custom Components
  import ImagesSection from "../shared/image-input/index.vue";
  import InputContent from "../shared/input-content/index.vue";

  const { postingImages, setValidateInput, createPosting } = usePostingInput();

  const { t } = useI18n({ useScope: "global" });

  const props = defineProps({ directoryId: { type: Number, required: true } });

  const form = ref();
  const initialValues = ref({});

  const postingImage = inject("images") as Ref<PostingImages>;

  const emits = defineEmits(["close-dialog"]);

  const schema = yup.object({
    title: yup.string().required().label(t("posting.columns.title"))
  });

  function onOKClick(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        setValidateInput(values);
        await createPosting();
        emits("close-dialog");
      }
    });
  }

  onBeforeMount(() => {
    postingImage.value = postingImages.value;

    initialValues.value = {
      directoryId: props.directoryId,
      title: "",
      status: 1,
      memberId: 25,
      description: ""
    };
  });
</script>
