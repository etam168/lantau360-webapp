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
          <images-section
            @on-upload="uplaodImageToServer"
            @update-ranking="updateRanking"
            @delete-image="deleteImage"
          />
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
  import { Posting } from "@/interfaces/models/entities/posting";

  const {
    postingImages,
    setValidateInput,
    setPostingInput,
    updatePosting,
    loadGalleryImages,
    uploadImage,
    updateRanking,
    deleteImage
  } = usePostingInput();

  const { t } = useI18n({ useScope: "global" });

  const props = defineProps({
    directoryId: {
      type: Number,
      required: true
    },
    postingData: {
      type: Object as PropType<Posting>,
      required: true
    }
  });
  const form = ref();
  const initialValues = ref({});

  const postingImage = inject("images") as Ref<PostingImages>;

  const emits = defineEmits(["close-dialog"]);

  const schema = yup.object({
    title: yup.string().required().label(t("posting.columns.title"))
  });

  async function uplaodImageToServer(ranking: number, imageFile: any) {
    await uploadImage(ranking - 1, ranking, imageFile);
  }

  function onOKClick(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        setValidateInput(values);
        await updatePosting();
        emits("close-dialog");
      }
    });
  }

  onBeforeMount(() => {
    debugger;
    setPostingInput(props.postingData);
    loadGalleryImages();
    postingImage.value = postingImages.value;

    initialValues.value = {
      directoryId: props.directoryId,
      title: props.postingData.title,
      status: 1,
      description: props.postingData.description,
      memberId: props.postingData.memberId
    };
  });
</script>
