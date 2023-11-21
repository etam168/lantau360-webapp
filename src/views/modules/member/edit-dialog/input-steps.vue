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
        <q-card-section>
          <input-content />

          <!-- <building-facilities /> -->
        </q-card-section>

        <q-card-section>
          <!-- <image-input
            class="q-mx-md"
            @uploadCallback="onUploadImage"
            :img-source="row?.imagePath"
          /> -->
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
  import { useMemberInput } from "../shared/use-member-input";
  import { MemberDatatable } from "@/interfaces/datatable/member-datatable";
  import eventBus from "@/utils/event-bus";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  //import BuildingFacilities from "../shared/building-facilities.vue";
  import InputContent from "../shared/input-content.vue";
  //import ImageInput from "@/components/custom/image-input.vue";

  const props = defineProps({
    row: {
      type: Object as PropType<MemberDatatable>,
      required: true
    }
  });

  const { schema, setMemberInput, setValidatedInput, updateMember } = useMemberInput();

  const initialValues = ref({});

  const form = ref();

  const previewMember = inject("previewMember") as Ref<MemberDatatable>;
  const emit = defineEmits(["on-save", "on-change", "on-dialog-cancel"]);

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        setValidatedInput(values);
        await updateMember();
        eventBus.emit("LoadData");
        emit("on-save");
      }
    });
  }

  onMounted(() => {
    setMemberInput(props.row);

    previewMember.value = props.row;

    initialValues.value = {
      alias: props.row.alias,
      firstName: props.row.firstName,
      lastName: props?.row?.lastName,
      userName: props?.row?.userName,
      phone: props?.row?.phone,
      email: props?.row?.email,
      status: props?.row?.status,
      firstNameCn: props.row?.meta?.i18n?.["cn"]?.firstName ?? null,
      firstNameHk: props.row?.meta?.i18n?.["hk"]?.firstName ?? null,
      lastNameCn: props.row?.meta?.i18n?.["cn"]?.lastName ?? null,
      lastNameHk: props.row?.meta?.i18n?.["hk"]?.lastName ?? null
    };
  });

  function formUpdates(data: any) {
    previewMember.value.alias = data.alias;
    previewMember.value.firstName = data.firstName;
    previewMember.value.userName = data.userName;
    previewMember.value.phone = data.phone;
    previewMember.value.email = data.email;
    previewMember.value.meta ??= {};
    previewMember.value.meta.i18n ??= {};
    previewMember.value.meta.i18n["hk"] ??= {};
    previewMember.value.meta.i18n["cn"] ??= {};
    previewMember.value.meta.i18n["cn"]["firstName"] = data.firstNameCn;
    previewMember.value.meta.i18n["hk"]["firstName"] = data.firstNameHk;

    previewMember.value.lastName = data.lastName;
    previewMember.value.meta ??= {};
    previewMember.value.meta.i18n ??= {};
    previewMember.value.meta.i18n["hk"] ??= {};
    previewMember.value.meta.i18n["cn"] ??= {};
    previewMember.value.meta.i18n["cn"]["lastName"] = data.lastNameCn;
    previewMember.value.meta.i18n["hk"]["lastName"] = data.lastNameHk;
  }
</script>
