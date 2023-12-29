<template>
  <vee-form :validation-schema="schema" @submit="onSubmit" v-slot="{ meta, values }">
    <q-card-section>
      <vee-input
        :label="$t('auth.forgotPassword.otp')"
        :value="otp"
        icon="mdi-account"
        name="otp"
        placeholder="123 456"
      />

      <vee-input-password :label="$t('auth.login.password')" :value="password" name="password" />
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
  </vee-form>

  <q-card-actions class="q-px-md q-py-none justify-center">
    {{ $t("auth.register.haveAccount") }}

    <a href="#" @click="login" class="forgot-password-link">
      {{ $t("auth.register.login") }}
    </a>
  </q-card-actions>
</template>

<script setup lang="ts">
  // 3rd Party Import
  import { useQuasar } from "quasar";
  import axios from "axios";
  import * as yup from "yup";

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

  const loading = ref(false);

  const schema = yup.object({
    password: yup.string().required().min(4).label("Password")
  });

  function login() {
    emits("on-login");
  }

  const onSubmit = async (values: { otp: any; password: any }) => {
    loading.value = true;
    try {
      const response = await axios.post("MemberAuth/RecoverPassword", {
        email: prop.email,
        password: values.password,
        opt: values.otp
      });
      response.data;

      $q.notify({
        message: "Password reset successful",
        type: "positive",
        color: "primary"
      });
      emits("close-dialog");
    } catch (e: any) {
      $q.notify({
        message: e.message,
        type: "negative"
      });
      loading.value = false;
    }

    loading.value = false;
  };

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
