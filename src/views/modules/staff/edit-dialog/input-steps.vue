<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="editschema"
    @submit="onSubmit"
    v-slot="{ meta }"
  >
    <q-card class="full-height" style="display: grid; grid-template-rows: 1fr auto">
      <q-scroll-area>
        <q-card-actions class="q-px-xl q-pt-md">
          <staff-image-input @uploadCallback="onUploadImage" :img-source="row.imagePath" />
          <q-space />
          <toggle-status name="status" />
        </q-card-actions>

        <q-separator class="q-mt-sm" />

        <q-card-section>
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
  import { PropType, onMounted, provide, ref } from "vue";

  // 3rd Party Import
  import { Form } from "vee-validate";

  // .ts files
  import { StaffDatatable } from "@/interfaces/datatable/staff-datatable";
  import { useStaffInput } from "../use-staff-input";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import StaffImageInput from "@/components/custom/staff-image-input.vue";
  import InputContent from "../shared/input-content.vue";
  import ToggleStatus from "@/components/vee-validate/toggle-status.vue";

  const props = defineProps({
    row: {
      type: Object as PropType<StaffDatatable>,
      required: true
    }
  });

  const emit = defineEmits(["on-dialog-cancel"]);
  provide("isStaffCreate", false);
  provide("staffData", props.row);

  const { editschema, setStaffInput, setValidatedInput, updateStaff, addOrUpdateProfileImage } =
    useStaffInput();

  const initialValues = ref({});

  const form = ref();

  async function onUploadImage(image: any) {
    addOrUpdateProfileImage(image);
  }

  function cancelDialog() {
    emit("on-dialog-cancel");
  }

  function onSubmit(values: any) {
    form.value.validate().then((isValid: any) => {
      if (isValid) {
        setValidatedInput(values);
        updateStaff(cancelDialog);
      }
    });
  }

  onMounted(() => {
    setStaffInput(props.row);

    initialValues.value = {
      metaStaffAliasCn: props.row?.staffAliasAlt?.i18n?.["cn"]?.staffAlias ?? null,
      metaStaffAliasHk: props.row?.staffAliasAlt?.i18n?.["hk"]?.staffAlias ?? null,
      firstName: props.row?.firstName,
      lastName: props.row?.lastName,
      staffRole: props.row?.roleCode,
      email: props.row?.email,
      userName: props.row?.userName,
      staffAlias: props.row?.staffAlias,
      status: props.row?.status,
      roleCode: props.row?.roleCode
    };
  });
</script>

<style scoped>
  .splitter-pane {
    display: grid;
    grid-template-rows: 1fr auto;
    height: 100%;
  }

  .content-area {
    overflow: auto;
  }
</style>
