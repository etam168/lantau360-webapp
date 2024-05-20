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
        <q-card-section class="q-pa-none">
          <images-section @update-ranking="updateRanking" @delete-image="deleteImage" />
          <input-content />
        </q-card-section>
      </q-scroll-area>

      <q-card-actions class="q-py-md q-px-lg">
        <app-button color="primary" class="full-width" :label="$t('action.save')" type="submit" />
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
  import { usePostingInput } from "./use-posting-input";

  // Custom Components
  import ImagesSection from "./image-input/index.vue";
  import InputContent from "./input-content.vue";

  const {
    postingImages,
    setValidateInput,
    setPostingInput,
    createPosting,
    loadGalleryImages,
    updateRanking,
    deleteImage
  } = usePostingInput();

  const { t } = useI18n({ useScope: "global" });

  const props = defineProps({
    item: {
      type: Object as PropType<any>
    }
  });

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
    setPostingInput(props.item);
    loadGalleryImages();
    postingImage.value = postingImages.value;

    initialValues.value = {
      directoryId: props.item.meta.directory_id,
      title: props.item.title,
      status: 1,
      description: props.item.postingDescription,
      memberId: props.item.memberId
    };
  });
</script>
