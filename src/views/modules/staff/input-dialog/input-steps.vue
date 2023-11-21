<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="createschema"
    @submit="onSubmit"
    v-slot="{ meta, values }"
  >
    <q-card class="full-height" style="display: grid; grid-template-rows: 1fr auto">
      <q-scroll-area>
        <q-card-section>
          <staff-image-input @uploadCallback="onUploadImage" />
        </q-card-section>

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
  import { Ref, inject, onMounted, provide, ref } from "vue";

  // 3rd Party Import
  import { Form } from "vee-validate";

  // .ts files
  import { useStaffInput } from "../use-staff-input";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import InputContent from "../shared/input-content.vue";
  import StaffImageInput from "@/components/custom/staff-image-input.vue";
  import { StaffRole } from "@/interfaces/staffRole";

  const staffRoles = inject("staffRoles") as Ref<StaffRole[]>;

  const emit = defineEmits(["on-dialog-cancel"]);
  provide("isStaffCreate", true);

  const { createschema, setValidatedInput, createStaff, imagePath } = useStaffInput();
  const form = ref();
  const initialValues = ref({});

  onMounted(() => {
    const defaultRole = staffRoles.value.length > 0 ? staffRoles.value[0].roleCode : 0;
    initialValues.value = {
      status: 1,
      roleCode: defaultRole
    };
  });

  async function onUploadImage(image: any) {
    imagePath.value = image;
  }

  function cancelDialog() {
    emit("on-dialog-cancel");
  }

  function onSubmit(values: any) {
    form.value.validate().then((isValid: any) => {
      if (isValid) {
        setValidatedInput(values);
        createStaff(cancelDialog, values.password);
      }
    });
  }
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
