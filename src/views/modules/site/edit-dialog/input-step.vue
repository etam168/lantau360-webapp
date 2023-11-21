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

        <q-card-section class="q-pt-none">
          <images-section
            @on-upload="uplaodImageToServer"
            @update-ranking="updateRanking"
            @delete-image="deleteImage"
          />
        </q-card-section>

        <q-card-section>
          <input-content />
        </q-card-section>
      </q-scroll-area>

      <q-card-actions class="q-pa-lg">
        <app-button class="full-width" :label="$t('action.save')" type="submit" />
      </q-card-actions>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  // Vue Import
  import { Ref, inject, ref, provide, PropType, onMounted } from "vue";

  // 3rd Party Import
  import * as yup from "yup";
  import { useI18n } from "vue-i18n";
  import { Form } from "vee-validate";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { SiteDatatable } from "@/interfaces/datatable/site-datatable";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import ImagesSection from "../shared/image-input/index.vue";
  import InputContent from "../shared/input-content/index.vue";
  import { SiteImages } from "@/interfaces/models/gallery";
  import { useSiteInput } from "../shared/use-site-input";

  const {
    setSiteInput,
    siteImages,
    updateSite,
    setValidateInput,
    loadGalleryImages,
    uploadImage,
    updateRanking,
    deleteImage
  } = useSiteInput();

  const { t } = useI18n({ useScope: "global" });

  const props = defineProps({
    directoryList: {
      type: Array as PropType<Directory[]>
    },
    row: {
      type: Object as PropType<SiteDatatable>,
      required: true
    }
  });

  const emits = defineEmits(["close-dialog"]);

  const form = ref();
  const formValues = ref();
  const siteName = ref();

  const initialValues = ref({});
  const siteImage = inject("images") as Ref<SiteImages>;
  const previewData = inject("previewData") as Ref<SiteDatatable>;
  const description = inject("description") as Ref<any>;
  // const selectedBuilding = ref<DistrictBuilding>({} as DistrictBuilding);

  provide("formValues", formValues);
  provide("siteName", siteName);
  provide("formInitialValues", initialValues);
  provide("directoryList", props.directoryList);
  provide("isUpdateDialog", true);

  const schema = yup.object({
    siteName: yup.string().required().label(t("site.columns.siteName"))
  });

  async function uplaodImageToServer(ranking: number, imageFile: any) {
    await uploadImage(ranking - 1, ranking, imageFile);
  }

  function setFormValues(values: any) {
    formValues.value = values;

    previewData.value.siteName = values.siteName;
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
        await updateSite();
        emits("close-dialog");
      }
    });
  }

  onMounted(() => {
    setSiteInput(props.row);
    loadGalleryImages();
    description.value.enDescription = props.row.description;
    siteImages.value = siteImage.value;
    siteName.value = props.row?.siteName;
    previewData.value = props.row;

    initialValues.value = {
      title: props.row?.title,
      status: props.row?.status,
      siteName: props.row?.siteName,
      buttonText: props.row?.buttonText,
      subtitle1: props.row?.subtitle1,
      subtitle2: props.row?.subtitle2,
      subtitle3: props.row?.subtitle3,
      displayMask: props.row?.displayMask,
      description: props.row?.description,
      directoryId: props.row?.directoryId,
      latitude: props.row?.latitude,
      longitude: props.row?.longitude,

      contactWhatsApp: props.row?.contactWhatsApp,
      contactPhone: props.row?.contactPhone,
      contactOther: props.row?.contactOther,

      siteNameHk: props.row?.meta?.i18n?.["hk"]?.siteName ?? null,
      siteNameCn: props.row?.meta?.i18n?.["cn"]?.siteName ?? null,

      titleHk: props.row?.meta?.i18n?.["hk"]?.title ?? null,
      titleCn: props.row?.meta?.i18n?.["cn"]?.title ?? null,

      addressHk: props.row?.meta?.i18n?.["hk"]?.address ?? null,
      addressCn: props.row?.meta?.i18n?.["cn"]?.address ?? null
    };
  });
</script>
