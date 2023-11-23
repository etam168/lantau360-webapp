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
  import { BusinessDatatable } from "@/interfaces/datatable/business-datatable";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import ImagesSection from "../shared/image-input/index.vue";
  import InputContent from "../shared/input-content/index.vue";
  import { BusinessImages } from "@/interfaces/models/gallery";
  import { useBusinessInput } from "../shared/use-business-input";

  const {
    setBusinessInput,
    businessImages,
    updateBusiness,
    setValidateInput,
    loadGalleryImages,
    uploadImage,
    updateRanking,
    deleteImage
  } = useBusinessInput();

  const { t } = useI18n({ useScope: "global" });

  const props = defineProps({
    directoryList: {
      type: Array as PropType<Directory[]>
    },
    row: {
      type: Object as PropType<BusinessDatatable>,
      required: true
    }
  });

  const emits = defineEmits(["close-dialog"]);

  const form = ref();
  const formValues = ref();
  const businessName = ref();

  const initialValues = ref({});
  const businessImage = inject("images") as Ref<BusinessImages>;
  const previewData = inject("previewData") as Ref<BusinessDatatable>;
  const description = inject("description") as Ref<any>;

  // const selectedBuilding = ref<DistrictBuilding>({} as DistrictBuilding);

  provide("formValues", formValues);
  provide("businessName", businessName);
  provide("formInitialValues", initialValues);
  provide("directoryList", props.directoryList);
  provide("isUpdateDialog", true);

  const schema = yup.object({
    businessName: yup.string().required().label(t("business.columns.businessName"))
  });

  async function uplaodImageToServer(ranking: number, imageFile: any) {
    await uploadImage(ranking - 1, ranking, imageFile);
  }

  function setFormValues(values: any) {
    formValues.value = values;

    previewData.value.businessName = values.businessName;
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

    previewData.value.openTime = values.openTime;
    previewData.value.closeTime = values.closeTime;

    previewData.value.status = values.status;

    previewData.value.contactWhatsApp = values.contactWhatsApp;
    previewData.value.contactPhone = values.contactPhone;
    previewData.value.contactOther = values.contactOther;
  }

  function onOKClick(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        setValidateInput(values, description.value);
        await updateBusiness();
        emits("close-dialog");
      }
    });
  }

  onMounted(() => {
    setBusinessInput(props.row);
    loadGalleryImages();
    description.value.enDescription = props.row.description;
    businessImages.value = businessImage.value;
    businessName.value = props.row?.businessName;
    previewData.value = props.row;

    initialValues.value = {
      title: props.row?.title,
      status: props.row?.status,
      businessName: props.row?.businessName,
      buttonText: props.row?.buttonText,
      subtitle1: props.row?.subtitle1,
      subtitle2: props.row?.subtitle2,
      subtitle3: props.row?.subtitle3,
      displayMask: props.row?.displayMask,
      description: props.row?.description,
      directoryId: props.row?.directoryId,
      latitude: props.row?.latitude,
      longitude: props.row?.longitude,
      openTime: props.row?.openTime,
      closeTime: props.row?.closeTime,

      contactWhatsApp: props.row?.contactWhatsApp,
      contactPhone: props.row?.contactPhone,
      contactOther: props.row?.contactOther,

      businessNameHk: props.row?.meta?.i18n?.["hk"]?.businessName ?? null,
      businessNameCn: props.row?.meta?.i18n?.["cn"]?.businessName ?? null,

      titleHk: props.row?.meta?.i18n?.["hk"]?.title ?? null,
      titleCn: props.row?.meta?.i18n?.["cn"]?.title ?? null,

      addressHk: props.row?.meta?.i18n?.["hk"]?.address ?? null,
      addressCn: props.row?.meta?.i18n?.["cn"]?.address ?? null
    };
  });
</script>
