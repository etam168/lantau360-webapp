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
        icon="mdi-account"
        name="userName"
        placeholder="user@example.com"
      />

      <vee-input-password :label="$t('auth.login.password')" name="password" />
      <div>{{ setFormValues(values) }}</div>

      <q-item-label v-if="isEmailSent" class="text-red">{{
        $t("auth.login.pleaseCheckMails")
      }}</q-item-label>

      <q-item-label v-if="error" class="text-red">{{ message }}</q-item-label>
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
    invalid_user: "Invalid data, please provide the correct data",
    email_not_verified: "Email is not verified, please verify it first",
    invalid_credentials: "Username or password is incorrect",
    invalid_username: "Username or password is incorrect",
    email_sent_successfully: "Please check your email for the confirmation link",
    email_send_failed: "Unable to send email, please try again",
    username_required: "User name required"
  };

  const schema = yup.object({
    userName: yup.string().required().label("user name"),
    password: yup.string().required().min(4).label("Password")
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
      notify("Otp sent to email", "positive");
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
            notify(err.message, "negative");
            loading.value = false;
          });
      }
    });
  }

  function setFormValues(values: any) {
    userName.value = values.userName;
  }
</script>

<style scoped>
  .forgot-password-link {
    color: green; /* Change the color to your preferred link color */
    text-decoration: underline; /* Add an underline to mimic a link */
    cursor: pointer; /* Change the cursor to a pointer on hover */
    margin-right: 10px; /* Optional: Add some spacing between the link and the button */
  }
</style>
