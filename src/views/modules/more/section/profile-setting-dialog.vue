<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ $t(`more.profileSetting.title`) }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-card flat>
            <profile-setting-image />
            <q-card-section class="q-ma-none q-pa-none">
              <Form
                ref="form"
                class="full-height"
                :initial-values="initialValues"
                :validation-schema="schema"
                @submit="onSubmit"
                v-slot="{ meta }"
              >
                <q-item>
                  <q-item-section v-for="(field, index) in fullNameFields" :key="index">
                    <vee-input
                      :name="field.name"
                      :maxlength="field.maxlength"
                      stack-label
                      :label="$t(field.label)"
                    />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <vee-input
                      name="email"
                      :maxlength="20"
                      disable
                      icon="email"
                      :label="$t('auth.register.email')"
                    />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <vee-q-tel-input
                      name="phone"
                      defaultIso="HK"
                      :labelText="$t('auth.register.phone')"
                      :label="$t('auth.register.phone')"
                  /></q-item-section>
                </q-item>

                <q-card-actions>
                  <q-space />
                  <app-button
                    class="full-width"
                    :label="$t('more.profileSetting.save')"
                    color="primary"
                    type="submit"
                    size="md"
                  />
                </q-card-actions>
              </Form>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>
<script setup lang="ts">
  import { Form } from "vee-validate";
  import * as yup from "yup";

  // Interface files
  import { Member } from "@/interfaces/models/entities/member";

  // .ts files
  // import { BLOB_URL, PLACEHOLDER_AVATAR } from "@/constants";
  import { useMoreInput } from "../use-more-input";
  // import { useUserStore } from "@/stores/user";
  import ProfileSettingImage from "./profile-setting-image.vue";

  const props = defineProps({
    member: {
      type: Object as PropType<Member>,
      required: true
    }
  });

  // const userStore = useUserStore();
  const { eventBus } = useUtilities();
  // const { handleUpdateMemberAvatar } = useContentInput();
  const { t } = useI18n({ useScope: "global" });
  const { updateMember, setValidatedInput, setMemberInput, memberInput } = useMoreInput();

  // const imageRef = ref();
  // const imagePath = ref(null);

  const form = ref();
  const initialValues = ref({});
  const schema = yup.object({
    email: yup.string().min(3).required().label(t("area.columns.areaName"))
  });

  const { onDialogCancel, dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  // function onImageUpload() {
  //   imageRef.value.pickFiles();
  // }

  // function uploadImage() {
  //   handleUpdateMemberAvatar(imagePath.value);
  // }

  // const avatar = computed(() => {
  //   return userStore.avatar ? `${BLOB_URL}/${userStore.avatar}` : PLACEHOLDER_AVATAR;
  // });

  onMounted(() => {
    eventBus.on("ProfileSettingDialog", () => {
      isDialogVisible.value = false;
    });

    setMemberInput(props?.member);
    memberInput.value.memberId = props.member.memberId;
    initialValues.value = {
      email: props.member.email,
      firstName: props.member.firstName,
      lastName: props.member.lastName,
      phone: props.member.phone
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

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "ProfileSettingDialog");
  }

  const fullNameFields = [
    { name: "firstName", label: "auth.register.firstName", icon: "", maxlength: 20 },
    { name: "lastName", label: "auth.register.lastName", icon: "", maxlength: 20 }
  ];
</script>
