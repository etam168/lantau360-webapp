<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ $t(`more.profileSetting.title`) }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page style="min-height: calc(100vh - 74px)">
          <q-card flat>
            <profile-setting-image />
            <q-card-section
              class="q-ma-none q-pa-none"
              style="display: flex; justify-content: center; align-items: center"
            >
              <Form
                ref="form"
                class="full-height"
                :initial-values="initialValues"
                :validation-schema="schema"
                @submit="onSubmit"
                v-slot="{ meta }"
                :style="authStyle"
              >
                <q-item>
                  <q-item-section>
                    <vee-input
                      v-model="memberInput.alias"
                      name="alias"
                      :maxlength="20"
                      :label="$t('auth.register.alias')"
                    />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section v-for="(field, index) in fullNameFields" :key="index">
                    <vee-input
                      :name="field.name"
                      :maxlength="field.maxlength"
                      :label="$t(field.label)"
                    />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section> <vee-q-tel-input name="phone" defaultIso="HK" /></q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <app-button
                      :label="$t('more.profileSetting.save')"
                      color="primary"
                      type="submit"
                      class="q-mx-xl"
                    />
                  </q-item-section>
                </q-item>
              </Form>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import * as yup from "yup";
  import { Form } from "vee-validate";
  // Interface files
  import { Member } from "@/interfaces/models/entities/member";
  // .ts files
  import ProfileSettingImage from "./profile-setting-image.vue";
  import { useMoreInput } from "../use-more-input";

  const props = defineProps({
    data: {
      type: Object as PropType<Member>,
      required: true
    }
  });

  const authStyle = computed(() => ($q.screen.gt.sm ? { width: "60vw" } : { width: "100vw" }));

  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const { updateMember, setValidatedInput, setMemberInput, memberInput } = useMoreInput();

  const form = ref();
  const initialValues = ref({});
  const schema = yup.object({
    email: yup.string().min(3).required().label(t("auth.register.email"))
  });

  const { onDialogCancel, dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();

  onMounted(() => {
    setMemberInput(props?.data);
    memberInput.value.memberId = props.data.memberId;
    initialValues.value = {
      email: props.data.email,
      firstName: props.data.firstName,
      lastName: props.data.lastName,
      phone: props.data.phone
    };
  });

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        setValidatedInput(values);
        updateMember(onDialogCancel);
      }
    });
  }

  const fullNameFields = [
    { name: "firstName", label: "auth.register.firstName", icon: "", maxlength: 20 },
    { name: "lastName", label: "auth.register.lastName", icon: "", maxlength: 20 }
  ];
</script>
