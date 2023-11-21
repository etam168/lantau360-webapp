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
        {{ formUpdates(values) }}

        <q-card-actions class="q-px-xl q-pt-md">
          <round-image-input
            class="q-mx-md"
            @uploadCallback="onUploadImage"
            :img-source="row?.imagePath"
          />
          <q-space />
          <toggle-status name="status" />
        </q-card-actions>

        <q-separator class="q-mt-sm" />

        <q-card-section>
          <input-content />

          <!-- <building-facilities /> -->
        </q-card-section>
      </q-scroll-area>

      <q-card-actions class="q-pa-lg">
        <app-button class="full-width" :label="$t('action.save')" type="submit" />
        <q-space />
      </q-card-actions>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  import { PropType, Ref, inject, onMounted, ref } from "vue";

  // 3rd Party Import
  import { Form } from "vee-validate";

  //.ts
  import { useDirectoryInput } from "../shared/use-directory-input";
  import { DirectoryDatatable } from "@/interfaces/datatable/directory-datatable";
  import eventBus from "@/utils/event-bus";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  //import BuildingFacilities from "../shared/building-facilities.vue";
  import InputContent from "../shared/input-content.vue";
  import RoundImageInput from "@/components/custom/round-image-input.vue";
  import ToggleStatus from "@/components/vee-validate/toggle-status.vue";

  const props = defineProps({
    row: {
      type: Object as PropType<DirectoryDatatable>,
      required: true
    }
  });

  const { schema, setDirectoryInput, setValidatedInput, updateDirectory, imagePath, uploadImage } =
    useDirectoryInput();

  const initialValues = ref({});

  const form = ref();

  const previewImagePath = inject("imagePath") as Ref<any>;
  const previewDirectory = inject("previewDirectory") as Ref<DirectoryDatatable>;
  const emit = defineEmits(["on-save", "on-change", "on-dialog-cancel"]);

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        setValidatedInput(values);
        await updateDirectory();
        eventBus.emit("LoadData");
        emit("on-save");
      }
    });
  }

  onMounted(() => {
    setDirectoryInput(props.row);

    previewDirectory.value = props.row;

    initialValues.value = {
      directoryName: props.row.directoryName,
      shortName: props?.row?.shortName,
      groupId: props?.row?.groupId,
      description: props?.row?.description,
      status: props?.row?.status,
      directoryNameCn: props.row?.meta?.i18n?.["cn"]?.directoryName ?? null,
      directoryNameHk: props.row?.meta?.i18n?.["hk"]?.directoryName ?? null,
      shortNameCn: props.row?.meta?.i18n?.["cn"]?.shortName ?? null,
      shortNameHk: props.row?.meta?.i18n?.["hk"]?.shortName ?? null
    };
  });

  async function onUploadImage(image: any) {
    imagePath.value = image;
    previewImagePath.value = image;

    await uploadImage(props.row.directoryId, 1, image);
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
