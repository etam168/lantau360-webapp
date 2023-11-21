<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="onSubmit"
    v-slot="{ meta, values }"
  >
    <q-card class="full-height" style="display: grid; grid-template-rows: 1fr auto">
      <q-scroll-area>
        <!-- input content here -->
        {{ formUpdates(values) }}

        <q-card-actions class="q-px-xl q-pt-md">
          <round-image-input class="q-mx-md" @uploadCallback="onUploadImage" />
        </q-card-actions>

        <q-separator class="q-mt-sm" />

        <q-card-section>
          <input-content />

          <!-- <building-facilities /> -->
        </q-card-section>

        <q-card-section>
          <image-input @uploadCallback="onUploadImage" class="q-mx-md" label="Image Path" />
        </q-card-section>
      </q-scroll-area>

      <q-card-actions class="q-pa-md">
        <app-button class="full-width" :label="$t('action.save')" type="submit" />
        <q-space />
      </q-card-actions>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  import { Ref, inject, ref } from "vue";

  // 3rd Party Import
  import { Form } from "vee-validate";

  //.ts
  import { DirectoryInput } from "@/interfaces/input/directory-input";
  import { useDirectoryInput } from "../shared/use-directory-input";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  //import BuildingFacilities from "../shared/building-facilities.vue";
  import InputContent from "../shared/input-content.vue";
  import RoundImageInput from "@/components/custom/round-image-input.vue";

  const { schema, initialValues, setValidatedInput, createDirectory, imagePath } =
    useDirectoryInput();
  const form = ref();

  const previewImagePath = inject("imagePath") as Ref<any>;
  const previewDirectory = inject("previewDirectory") as Ref<DirectoryInput>;
  const emit = defineEmits(["on-save", "on-change"]);

  function onSubmit(values: any) {
    form.value.validate().then((isValid: any) => {
      if (isValid) {
        setValidatedInput(values);
        createDirectory();
        emit("on-save");
      }
    });
  }

  async function onUploadImage(image: any) {
    imagePath.value = image;
    previewImagePath.value = image;
  }

  function formUpdates(data: any) {
    previewDirectory.value.directoryName = data.directoryName;
    previewDirectory.value.description = data.description;
    previewDirectory.value.groupId = data.groupId;
    previewDirectory.value.meta ??= {};
    previewDirectory.value.meta.i18n ??= {};
    previewDirectory.value.meta.i18n["hk"] ??= {};
    previewDirectory.value.meta.i18n["cn"] ??= {};
    previewDirectory.value.meta.i18n["cn"]["directoryName"] = data.directoryNameCn;
    previewDirectory.value.meta.i18n["hk"]["directoryName"] = data.directoryNameHk;

    previewDirectory.value.shortName = data.shortName;
    previewDirectory.value.meta ??= {};
    previewDirectory.value.meta.i18n ??= {};
    previewDirectory.value.meta.i18n["hk"] ??= {};
    previewDirectory.value.meta.i18n["cn"] ??= {};
    previewDirectory.value.meta.i18n["cn"]["shortName"] = data.shortNameCn;
    previewDirectory.value.meta.i18n["hk"]["shortName"] = data.shortNameHk;
  }
</script>
