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
        {{ description }}
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
  // Vue Import
  import { Ref, inject, ref, onMounted, provide } from "vue";

  // 3rd Party Import
  import * as yup from "yup";
  import { useI18n } from "vue-i18n";
  import { Form } from "vee-validate";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import ImagesSection from "../shared/image-input/index.vue";

  import InputContent from "../shared/input-content/index.vue";
  import { useSiteInput } from "../shared/use-site-input";
  import { SiteImages } from "@/interfaces/models/gallery";
  import { SiteDatatable } from "@/interfaces/datatable/site-datatable";

  const { siteImages, setValidateInput, createSite } = useSiteInput();

  const { t } = useI18n({ useScope: "global" });

  const form = ref();
  const initialValues = ref({});
  const formValues = ref();
  const siteName = ref();

  const siteImage = inject("images") as Ref<SiteImages>;
  const previewData = inject("previewData") as Ref<SiteDatatable>;
  const description = inject("description") as Ref<any>;

  const directoryList = ref(inject<Directory[]>("directoryList") || []);

  provide("formValues", formValues);
  provide("siteName", siteName);
  provide("formInitialValues", initialValues);
  provide("directoryList", directoryList);
  //git commit -m "fix preview data of newly created building in site dialog"
  const emits = defineEmits(["close-dialog"]);

  const schema = yup.object({
    siteName: yup.string().required().label(t("site.columns.siteName"))
  });

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
        alert(1);
        setValidateInput(values, description.value);
        alert(2);
        await createSite();
        alert(3);
        emits("close-dialog");
      }
    });
  }

  onMounted(() => {
    siteImage.value = siteImages.value;

    initialValues.value = {
      siteId: 0,
      title: "",
      status: 1,
      siteName: "",
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
      siteNameHk: "",
      siteNameCn: "",
      titleHk: "",
      titleCn: "",
      addressHk: "",
      addressCn: ""
    };
  });
</script>
