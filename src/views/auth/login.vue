<template>
  <vee-form :validation-schema="schema" @submit="onSubmit" v-slot="{ meta, values }">
    <q-card-section>
      <vee-input
        :label="$t('auth.login.userName')"
        :value="userName"
        icon="mdi-account"
        name="userName"
        placeholder="user@example.com"
      />

      <app-input-password :label="$t('auth.login.password')" :value="password" name="password" />
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
          size="lg"
        />
      </q-card-actions>
    </q-card-section>
  </vee-form>

  <q-card-actions class="q-px-md q-py-none">
    <a href="#" @click="handleForgotPassword" class="forgot-password-link">
      {{ $t("auth.login.forgotPassword") }}
    </a>
    <q-space />
    <app-button-localization dense color="dark" />
  </q-card-actions>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";
  import { useRoute, useRouter } from "vue-router";

  // 3rd Party Import
  import { useQuasar } from "quasar";
  import { useUserStore } from "@/stores/user";
  import * as yup from "yup";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import AppButtonLocalization from "@/components/widgets/app-button-localization.vue";
  import AppInputPassword from "@/components/widgets/app-input-password.vue";
  import VeeInput from "@/components/vee-validate/vee-input.vue";
  import axios from "axios";
  import { LocalStorage } from "quasar";
  import { STORAGE_KEYS } from "@/constants";

  const $q = useQuasar();

  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();
  const userName = ref("");

  const password = ref("");

  const loading = ref(false);

  const isEmailSent = ref(false);

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

      await axios.post(`/StaffAuth/ResetPasswordRequest/${userName.value}`);
      isEmailSent.value = true;
    } catch (e: any) {
      $q.notify({
        message: e.message,
        type: "negative"
      });
    }
    loading.value = false;
  }
  const onSubmit = async (values: { userName: any; password: any }) => {
    loading.value = true;
    try {
      await userStore.loginByUserName({
        userName: values.userName,
        password: values.password
      });
      $q.notify({
        message: "Login successful",
        type: "positive",
        color: "primary"
      });
      LocalStorage.set(STORAGE_KEYS.IsLogOn, true);
      await router.push(route.query.redirect?.toString() || "/");
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
