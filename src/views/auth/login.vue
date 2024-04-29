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

      <q-card-actions class="q-mt-lg q-pa-none">
        <app-button
          :label="$t('auth.login.button')"
          :loading="loading"
          class="full-width"
          color="primary"
          type="submit"
          size="md"
        />
      </q-card-actions>
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

  // .ts files
  import { useUserStore } from "@/stores/user";
  import { STORAGE_KEYS } from "@/constants";

  const emits = defineEmits(["close-dialog", "on-forgotPassword", "on-login-success"]);

  const { notify } = useUtilities();
  const { t } = i18n.global;
  const userStore = useUserStore();
  const userName = ref("");

  const loading = ref(false);

  const isEmailSent = ref(false);

  const form = ref();
  const initialValues = ref({
    userName: "",
    password: ""
  });
  const schema = yup.object({
    userName: yup.string().required().label("user name"),
    password: yup.string().required().min(4).label("Password")
  });

  async function handleForgotPassword() {
    if (userName.value == "") {
      notify(t("errors.usernameRequired"), "negative");
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

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;

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
