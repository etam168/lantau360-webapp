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
        :label="$t('auth.register.email')"
        icon="mdi-account"
        name="email"
        placeholder="user@example.com"
      />
      <vee-input
        :label="$t('auth.register.firstName')"
        icon="mdi-account"
        name="firstName"
        :placeholder="$t('auth.register.firstName')"
      />
      <vee-input
        :label="$t('auth.register.lastName')"
        icon="mdi-account"
        name="lastName"
        :placeholder="$t('auth.register.lastName')"
      />

      <vee-q-tel-input name="phone" defaultIso="HK" />
      <!-- <vee-input
        :label="$t('auth.register.phone')"
        icon="mdi-account"
        name="phone"
        placeholder="Phone"
      /> -->

      <vee-input-password :label="$t('auth.login.password')" name="password" />
      <div>{{ setFormValues(values) }}</div>
      <q-card-actions class="q-mt-lg q-pa-none">
        <app-button
          :label="$t('auth.register.register')"
          :loading="loading"
          class="full-width"
          color="primary"
          type="submit"
          size="md"
        />
      </q-card-actions>
    </q-card-section>
  </Form>

  <q-card-actions class="q-px-md q-py-none bg-secondary justify-center">
    {{ $t("auth.register.haveAccount") }}

    <a href="#" @click="login" class="forgot-password-link">
      {{ $t("auth.register.login") }}
    </a>
  </q-card-actions>
</template>

<script setup lang="ts">
  import { Form } from "vee-validate";
  import { LocalStorage } from "quasar";
  import * as yup from "yup";

  // .ts files
  import { STORAGE_KEYS } from "@/constants";
  import i18n from "@/plugins/i18n/i18n";

  const emits = defineEmits(["close-dialog", "on-login"]);
  const { notify } = useUtilities();
  const { t } = i18n.global;

  const email = ref("");
  const firstName = ref("");
  const lastName = ref("");
  const phone = ref("");
  const password = ref("");

  const loading = ref(false);
  const form = ref();
  const initialValues = ref({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: ""
  });
  const schema = yup.object({
    email: yup.string().email().required().label(t("auth.register.userName")),
    password: yup.string().required().min(4).label(t("auth.password.password"))
  });

  function login() {
    emits("on-login");
  }
  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;
        try {
          const response = await axios.post("MemberAuth/SingUp", {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            password: values.password,
            userName: values.email,
            status: 1
          });
          response;
          notify(t("auth.emailMessages.emailSentSuccessfully"), "positive");
          LocalStorage.set(STORAGE_KEYS.IsLogOn, true);
          emits("close-dialog");
        } catch (err) {
          if (err instanceof AxiosError) {
            if (err.response?.status === 400 && err.response?.data === "email_already_exists") {
              notify(t("errors.emialAreadyExists"), "negative");
            } else if (
              err.response?.status === 400 &&
              err.response?.data === "something_went_wrong"
            ) {
              notify(t("errors.anErrorOccured"), "negative");
            } else {
              notify(t("errors.anUnExpectedError"), "negative");
            }
          } else {
            notify((err as any).message, "negative");
          }
          loading.value = false;
        }

        loading.value = false;
      }
    });
  }

  function setFormValues(values: any) {
    email.value = values.email;
    firstName.value = values.firstName;
    lastName.value = values.lastName;
    phone.value = values.phone;
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
