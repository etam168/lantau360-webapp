<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="onSubmit"
    v-slot="{ meta, values }"
  >
    <q-card-section class="bg-secondary">
      <vee-input
        :label="$t('auth.login.userName')"
        icon="mdi-account"
        name="userName"
        placeholder="user@example.com"
      />

      <vee-input-password :label="$t('auth.login.password')" name="password" />
      <div>{{ setFormValues(values) }}</div>

      <q-item-label v-if="isEmailSent" class="text-red"
        >Please check your mails, If you havn't received an email then please contact the
        administrator</q-item-label
      >

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

    <q-card-actions class="q-px-md q-py-none bg-secondary">
      <a href="#" @click="handleForgotPassword" class="forgot-password-link">
        {{ $t("auth.login.forgotPassword") }}
      </a>
      <q-space />
      <app-button-localization dense color="dark" />
    </q-card-actions>
  </Form>
</template>

<script setup lang="ts">
  // 3rd Party Import
  import { Form } from "vee-validate";
  import { LocalStorage, useQuasar } from "quasar";
  import * as yup from "yup";

  // .ts files
  import { useUserStore } from "@/stores/user";
  import { STORAGE_KEYS } from "@/constants";

  const emits = defineEmits(["close-dialog", "on-forgotPassword"]);

  const $q = useQuasar();

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
      $q.notify({
        message: "Username required",
        type: "negative"
      });
      return;
    }
    try {
      loading.value = true;
      await axios.post(`/MemberAuth/SendOtp/${userName.value}`);
      isEmailSent.value = true;
      emits("on-forgotPassword", userName.value);
      $q.notify({
        message: "Otp sent to email",
        type: "positive"
      });
    } catch (e: any) {
      $q.notify({
        message: e.message,
        type: "negative"
      });
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
            $q.notify({
              message: "Login successful",
              type: "positive",
              color: "primary"
            });
            LocalStorage.set(STORAGE_KEYS.IsLogOn, true);
            emits("close-dialog");
          })
          .catch(err => {
            $q.notify({
              message: err.message,
              type: "negative"
            });
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
