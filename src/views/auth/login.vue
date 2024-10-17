<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="onSubmit"
    v-slot="{ meta, values }"
  >
    <q-card-section class="bg-secondary q-ma-none q-pa-xs">
      <vee-input
        :label="$t('auth.login.userName')"
        icon="fa-solid fa-user"
        name="userName"
        placeholder="user@example.com"
        @update:model-value="onUpdateFormfield"
      />

      <vee-input-password
        :label="$t('auth.login.password')"
        name="password"
        @update:model-value="onUpdateFormfield"
      />
      <div>{{ setFormValues(values) }}</div>

      <q-item-label v-if="isEmailSent" class="text-red q-mt-md">{{
        $t("auth.login.pleaseCheckMails")
      }}</q-item-label>
      <q-item-label v-if="error" class="text-red q-mt-md">{{ message }}</q-item-label>
    </q-card-section>
    <q-card-section class="bg-secondary">
      <q-item>
        <app-button
          :label="$t('auth.login.button')"
          :loading="loading"
          class="full-width"
          color="primary"
          type="submit"
          size="md"
        />
        <div v-if="shoulShowResendButton" style="width: 40px"></div>
        <app-button
          v-if="shoulShowResendButton"
          label="Resend link"
          :loading="resendEmaiLoading"
          class="full-width"
          color="red"
          size="md"
          @click="resendEmailVerificationLink(values)"
        />
      </q-item>
    </q-card-section>

    <q-card-actions class="q-px-md q-py-sm bg-secondary">
      <a href="#" @click="handleForgotPassword" class="forgot-password-link">
        {{ $t("auth.login.forgotPassword") }}
      </a>
      <q-space />
    </q-card-actions>
  </Form>
</template>

<script setup lang="ts">
  // 3rd Party Import
  import { Form } from "vee-validate";
  import { LocalStorage } from "quasar";
  import * as yup from "yup";
  import i18n from "@/plugins/i18n/i18n";
  import axios, { AxiosError } from "axios";

  // .ts files
  import { useUserStore } from "@/stores/user";
  import { STORAGE_KEYS } from "@/constants";

  const emits = defineEmits(["close-dialog", "on-forgotPassword", "on-login-success"]);

  const { notify } = useUtilities();
  const { t } = i18n.global;
  const userStore = useUserStore();
  const userName = ref("");

  const loading = ref(false);
  const resendEmaiLoading = ref(false);
  const message = ref("");
  const error = ref(false);
  const isEmailSent = ref(false);
  const shoulShowResendButton = ref(false);
  const form = ref();
  const initialValues = ref({
    userName: "",
    password: ""
  });

  const messages: any = {
    invalid_user: t("auth.emailMessages.invalidUser"),
    email_not_verified: t("errors.emailNotVerified"),
    invalid_credentials: t("errors.invalidCredentials"),
    invalid_username: t("errors.invalidUsername"),
    email_sent_successfully: t("auth.emailMessages.emailSentSuccessfully"),
    email_send_failed: t("auth.emailMessages.emailSendFailed"),
    username_required: t("errors.usernameRequired"),
    email_already_verified: t("auth.emailMessages.emailAlreadyVerified")
  };

  const schema = yup.object({
    userName: yup.string().required().label(t("auth.login.userName")),
    password: yup.string().required().min(4).label(t("auth.login.password"))
  });

  async function handleForgotPassword() {
    if (userName.value == "") {
      error.value = true;
      message.value = messages.username_required;
      return;
    }
    try {
      loading.value = true;
      await axios.post(`/MemberAuth/SendOtp/${userName.value}`);
      isEmailSent.value = true;
      emits("on-forgotPassword", userName.value);
      notify(t("auth.forgotPassword.otpMessage"), "positive");
    } catch (e: any) {
      notify(e.message, "negative");
    }
    loading.value = false;
  }

  const handleAxiosError = (err: AxiosError) => {
    if (err.response) {
      const { data } = err.response;
      if (data === "email_not_verified") {
        shoulShowResendButton.value = true;
      }
      message.value = messages[data as string] || messages.email_send_failed;
    } else {
      message.value = messages.email_send_failed;
      error.value = true;
    }
  };

  function resendEmailVerificationLink(values: any) {
    const username = values.userName;
    const password = values.password;
    const invalidUser = !username || username == null || username == "";
    const invalidePassword = !password || password == null || password == "";
    if (invalidUser || invalidePassword || loading.value) {
      return;
    }

    resendEmaiLoading.value = true;
    error.value = false;

    axios
      .post("/MemberAuth/SendEmailConfirmationLink", {
        login: values.userName,
        password: values.password
      })
      .then(() => {
        resendEmaiLoading.value = false;
        shoulShowResendButton.value = false;
        error.value = true;
        message.value = messages.email_sent_successfully;
      })
      .catch(err => {
        handleAxiosError(err as any);
        error.value = true;
        resendEmaiLoading.value = false;
      });
  }

  function onSubmit(values: any) {
    if (resendEmaiLoading.value) {
      return;
    }

    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;
        error.value = false;
        await axios
          .post("/MemberAuth/SignIn", { login: values.userName, password: values.password })
          .then(async response => {
            userStore.SetUserInfo(response.data);
            notify(t("auth.login.successFulLoginMessage"), "positive");
            LocalStorage.set(STORAGE_KEYS.IsLogOn, true);
            emits("close-dialog");
            emits("on-login-success");
          })
          .catch(err => {
            handleAxiosError(err as any);
            error.value = true;
            loading.value = false;
          });
      }
    });
  }

  function setFormValues(values: any) {
    userName.value = values.userName;
  }

  function onUpdateFormfield() {
    error.value = false;
  }
</script>

<style scoped>
  .forgot-password-link {
    color: green;
    text-decoration: underline;
    cursor: pointer;
    margin-right: 10px;
  }
</style>
