<template>
  <vee-form :validation-schema="schema" @submit="onSubmit" v-slot="{ meta, values }">
    <q-card-section>
      <vee-input
        :label="$t('auth.register.email')"
        :value="email"
        icon="mdi-account"
        name="email"
        placeholder="user@example.com"
      />
      <vee-input
        :label="$t('auth.register.firstName')"
        :value="firstName"
        icon="mdi-account"
        name="firstName"
        placeholder="First Name"
      />
      <vee-input
        :label="$t('auth.register.lastName')"
        :value="lastName"
        icon="mdi-account"
        name="lastName"
        placeholder="Last Name"
      />
      <vee-input
        :label="$t('auth.register.phone')"
        :value="phone"
        icon="mdi-account"
        name="phone"
        placeholder="Phone"
      />

      <app-input-password :label="$t('auth.login.password')" :value="password" name="password" />
      <div>{{ setFormValues(values) }}</div>
      <q-card-actions class="q-mt-lg q-pa-none">
        <app-button
          :label="$t('auth.register.register')"
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
  // Vue Import

  // 3rd Party Import
  import { useQuasar } from "quasar";
  import * as yup from "yup";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import AppInputPassword from "@/components/widgets/app-input-password.vue";
  import VeeInput from "@/components/vee-validate/vee-input.vue";
  // import axios from "axios";
  import { LocalStorage } from "quasar";
  import { STORAGE_KEYS } from "@/constants";
  import { ref } from "vue";
  import axios from "axios";

  const emits = defineEmits(["close-dialog", "on-login"]);

  const $q = useQuasar();

  // const route = useRoute();
  const email = ref("");
  const firstName = ref("");
  const lastName = ref("");
  const phone = ref("");
  const password = ref("");

  const loading = ref(false);

  const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required().min(4).label("Password")
  });

  function login() {
    emits("on-login");
  }

  const onSubmit = async (values: {
    email: any;
    firstName: any;
    lastName: any;
    phone: any;
    password: any;
  }) => {
    loading.value = true;
    debugger;
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
      console.log("API response:", response.data);
      $q.notify({
        message: "Register successful",
        type: "positive",
        color: "primary"
      });
      LocalStorage.set(STORAGE_KEYS.IsLogOn, true);
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
