<template>
  <suspense>
    <template #default>
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
                <q-card-actions>
                  <q-btn outline round color="black" class="q-mr-xl">
                    <q-avatar size="128px">
                      <q-img :src="computePath">
                        <template v-slot:error>
                          <q-img :src="PLACEHOLDER_AVATAR" />
                        </template>

                        <template v-slot:loading>
                          <div class="absolute-full flex flex-center bg-gray text-white">
                            <q-inner-loading
                              showing
                              class="spinner-card row justify-center items-center"
                            >
                              <q-spinner size="50px" color="primary" />
                            </q-inner-loading>
                          </div>
                        </template>
                      </q-img>

                      <q-badge class="absolute-bottom-left" color="transparent">
                        <app-button
                          round
                          color="black"
                          icon="photo_camera"
                          size="xs"
                          @click="onImageUpload"
                        />
                      </q-badge>
                    </q-avatar>

                    <q-file
                      ref="imageRef"
                      v-show="false"
                      v-model="imagePath"
                      @update:model-value="uploadImage"
                    >
                    </q-file>
                  </q-btn>
                  <div class="text-subtitle1 text-weight-medium">
                    {{ $t("more.profileSetting.subtitle") }}
                  </div>
                </q-card-actions>

                <q-card-section>
                  <Form
                    ref="form"
                    class="full-height"
                    :initial-values="initialValues"
                    :validation-schema="schema"
                    @submit="onSubmit"
                    v-slot="{ meta }"
                  >
                    <vee-input
                      :label="$t('auth.register.email')"
                      icon="mdi-account"
                      name="email"
                      disable
                      placeholder="user@example.com"
                    />
                    <vee-input
                      :label="$t('auth.register.firstName')"
                      icon="mdi-account"
                      name="firstName"
                      placeholder="First Name"
                    />
                    <vee-input
                      :label="$t('auth.register.lastName')"
                      icon="mdi-account"
                      name="lastName"
                      placeholder="Last Name"
                    />

                    <vee-input
                      :label="$t('auth.register.phone')"
                      icon="mdi-account"
                      name="phone"
                      placeholder="Phone"
                    />
                    <app-button
                      class="full-width"
                      :label="$t('more.profileSetting.save')"
                      type="submit"
                    />
                  </Form>
                </q-card-section>
              </q-card>
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>
    </template>
    <template #fallback>
      <div class="row justify-center items-center" style="height: 500px"></div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  import { Form } from "vee-validate";
  import * as yup from "yup";

  // Other Import
  import { BLOB_URL, PLACEHOLDER_AVATAR } from "@/constants";

  import { useUserStore } from "@/stores/user";
  import { useMoreInput } from "../use-more-input";
  import { Member } from "@/interfaces/models/entities/member";

  const props = defineProps({
    member: {
      type: Object as PropType<Member>,
      required: true
    }
  });
  const { eventBus } = useUtilities();

  const { handleUpdateMemberAvatar } = useContentInput();

  const userStore = useUserStore();
  const { t } = useI18n({ useScope: "global" });

  const { updateMember, setValidatedInput, setMemberInput, memberInput } = useMoreInput();

  const imageRef = ref();
  const imagePath = ref(null);

  const form = ref();
  const initialValues = ref({});
  const schema = yup.object({
    email: yup.string().min(3).required().label(t("area.columns.areaName"))
  });

  const { onDialogCancel, dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  function onImageUpload() {
    imageRef.value.pickFiles();
  }

  function uploadImage() {
    handleUpdateMemberAvatar(imagePath.value);
  }

  const computePath = computed(() => {
    return userStore.avatar ? `${BLOB_URL}/${userStore.avatar}` : PLACEHOLDER_AVATAR;
  });

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
</script>
