<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="onOKClick"
    v-slot="{ meta, values }"
  >
    <q-card class="full-height" style="display: grid; grid-template-rows: 1fr auto">
      <q-scroll-area>
        {{ setFormValues(values) }}
        <q-card-section>
          <images-section />
          <input-content />
        </q-card-section>
      </q-scroll-area>

      <q-card-actions class="q-pa-md">
        <app-button class="full-width" :label="$t('action.save')" type="submit" />
      </q-card-actions>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  import * as yup from "yup";
  import { useI18n } from "vue-i18n";
  import { Form } from "vee-validate";

  // Interface files
  import { Description } from "@/interfaces/models/custom-models/description";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { PostingImages } from "@/interfaces/models/custom-models/gallery";

  // .ts files
  import { usePostingInput } from "../shared/use-posting-input";

  // Custom Components
  import ImagesSection from "../shared/image-input/index.vue";
  import InputContent from "../shared/input-content/index.vue";

  const { postingImages, setValidateInput, createPosting } = usePostingInput();

  const { t } = useI18n({ useScope: "global" });

  const form = ref();
  const initialValues = ref({});
  const formValues = ref();
  const postingName = ref();

  const postingImage = inject("images") as Ref<PostingImages>;
  const previewData = inject("previewData") as Ref<Posting>;
  const description = inject("description") as Ref<Description>;

  provide("formValues", formValues);
  provide("postingName", postingName);
  provide("formInitialValues", initialValues);
  //git commit -m "fix preview data of newly created building in posting dialog"
  const emits = defineEmits(["close-dialog"]);

  const schema = yup.object({
    postingName: yup.string().required().label(t("posting.columns.postingName"))
  });

  function setFormValues(values: any) {
    formValues.value = values;

    previewData.value.postingName = values.postingName;
    previewData.value.buttonText = values.buttonText;

    previewData.value.title = values.title;
    previewData.value.subtitle1 = values.subtitle1;
    previewData.value.subtitle2 = values.subtitle2;
    previewData.value.subtitle3 = values.subtitle3;
    previewData.value.displayMask = values.displayMask;

    previewData.value.description = values.description;

    previewData.value.directoryId = values.directoryId;
    previewData.value.latitude = values.latitude;
    previewData.value.longitude = values.longitude;

    previewData.value.status = values.status;

    previewData.value.contactWhatsApp = values.contactWhatsApp;
    previewData.value.contactPhone = values.contactPhone;
    previewData.value.contactOther = values.contactOther;
  }

  function onOKClick(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        setValidateInput(values, description.value);
        await createPosting();
        emits("close-dialog");
      }
    });
  }

  onMounted(() => {
    postingImage.value = postingImages.value;

    initialValues.value = {
      postingId: 0,
      title: "",
      status: 1,
      memberId: 25,
      postingName: "",
      buttonText: "",
      subtitle1: "",
      subtitle2: "",
      subtitle3: "",
      description: "",
      directoryId: 0,
      latitude: 22,
      longitude: 112,
      contactWhatsApp: "",
      contactPhone: "",
      contactOther: "",
      postingNameHk: "",
      postingNameCn: "",
      titleHk: "",
      titleCn: "",
      subtitle1Hk: "",
      subtitle1Cn: "",
      rank: 0
    };
  });
</script>
