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
        :label="$t('auth.forgotPassword.otp')"
        icon="mdi-account"
        name="otp"
        placeholder="123 456"
      />

      <vee-input-password :label="$t('auth.login.password')" name="password" />
      <div>{{ setFormValues(values) }}</div>
      <q-card-actions class="q-mt-lg q-pa-none">
        <app-button
          :label="$t('auth.forgotPassword.update')"
          :loading="loading"
          class="full-width"
          color="primary"
          type="submit"
          size="lg"
        />
      </q-card-actions>
    </q-card-section>
  </Form>

  <q-card-actions class="bg-secondary q-px-md q-py-none justify-center">
    {{ $t("auth.register.haveAccount") }}

    <a href="#" @click="login" class="forgot-password-link">
      {{ $t("auth.register.login") }}
    </a>
  </q-card-actions>
</template>

<script setup lang="ts">
  // 3rd Party Import
  import { Form } from "vee-validate";
  import * as yup from "yup";
  import i18n from "@/plugins/i18n/i18n";

  const emits = defineEmits(["close-dialog", "on-login"]);
  const $q = useQuasar();

  const prop = defineProps({
    email: {
      type: String,
      required: true
    }
  });

  const otp = ref("");
  const password = ref("");
  const { notify } = useUtilities();
  const { t } = i18n.global;

  const loading = ref(false);
  const form = ref();
  const initialValues = ref({
    otp: "",
    password: ""
  });
  const schema = yup.object({
    password: yup.string().required().min(4).label(t("auth.login.password"))
  });

  function login() {
    emits("on-login");
  }

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;
        try {
          const response = await axios.post("MemberAuth/RecoverPassword", {
            email: prop.email,
            newPassword: values.password,
            otp: values.otp
          });
          response.data;
          notify(t("auth.login.passwordResetSuccessfully"), "positive");
          emits("close-dialog");
        } catch (e: any) {
          $q.notify({
            message: e.message,
            type: "negative"
          });
          loading.value = false;
        }

        loading.value = false;
      }
    });
  }

  function setFormValues(values: any) {
    otp.value = values.phone;
    password.value = values.password;
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
