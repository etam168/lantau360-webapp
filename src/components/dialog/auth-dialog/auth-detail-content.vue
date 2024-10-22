<template>
  <q-page class="column items-center justify-center">
    <q-card class="bg-secondary" :style="authStyle" :flat="$q.screen.lt.sm">
      <app-bar-dialog-close v-if="$q.screen.gt.xs" />
      <app-auth-avatar class="q-my-md" />

      <Form
        ref="form"
        class="full-height bg-transparent"
        :initial-values="initialValues"
        :validation-schema="schema"
        @submit="onSubmit"
        v-slot="{ meta, values }"
      >
        <q-list class="q-px-md">
          <q-item v-for="(item, index) in renderItems" :key="index" dense>
            <q-item-section>
              <vee-input-password
                v-if="item.type === 'password'"
                :name="item.name"
                :label="$t('auth.login.password')"
              />

              <app-button
                v-else-if="item.type === 'submit'"
                class="full-width"
                color="primary"
                :label="item.label"
                type="submit"
              />

              <app-button-flat
                v-else-if="item.type === 'flatButton'"
                :label="item.label"
                @click="handleClick(item.name)"
              />

              <vee-q-tel-input
                v-else-if="item.type === 'phone'"
                :name="item.name"
                defaultIso="HK"
              />
              <!-- <vee-otp-input v-if="item.type === 'otp'" :name="item.name" :label="item.label" /> -->
              <vee-input v-else-if="item.type === 'input'" :name="item.name" :label="item.label" />
            </q-item-section>
          </q-item>

          <q-item-label v-if="error" class="text-red q-mt-md">{{ message }}</q-item-label>
        </q-list>
      </Form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import type { AuthMode } from "@/interfaces/types/auth-mode";

  import { fasXmark } from "@quasar/extras/fontawesome-v6";
  import * as yup from "yup";
  import { Form } from "vee-validate";

  // .ts files
  import { SubField } from "@/interfaces/types/form-structure-types";

  // Props
  const { mode } = defineProps<{
    mode?: AuthMode;
  }>();

  const emits = defineEmits(["close-dialog", "on-forgotPassword", "on-login-success"]);

  const { loginRequest, registerRequest, recoverPassword } = useAuthService();
  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const { notify } = useUtilities();

  const form = ref();
  const loading = ref(false);
  const resendEmaiLoading = ref(false);
  const message = ref("");
  const i18nKey = "auth";
  const error = ref(false);

  const userName = ref("");

  const initialValues = ref({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    otp: ""
  });

  const schema = yup.object({});

  const authStyle = computed(() =>
    $q.screen.lt.sm ? { width: "100%", opacity: "100%" } : { width: "520px", opacity: "90%" }
  );

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

  const renderMode = ref(mode);

  const renderItems = computed<SubField[]>(() => {
    const getItems = (): SubField[] => {
      switch (renderMode.value) {
        case "register":
          return [
            { name: "userName", type: "input" },
            { name: "firstName", type: "input" },
            { name: "lastName", type: "input" },
            { name: "phone", type: "phone" },
            { name: "password", type: "password" },
            { name: "register", type: "submit" }
          ];
        case "reset":
          return [
            { name: "otp", type: "input" },
            { name: "password", type: "password" },
            { name: "resetPassword", type: "submit" }
          ];
        default:
          // Default is login
          return [
            { name: "userName", type: "input" },
            { name: "password", type: "password" },
            { name: "signIn", type: "submit" },
            { name: "forgetPassword", type: "flatButton" }
          ];
      }
    };

    return getItems().map(item => ({
      ...item,
      label: `${i18nKey}.${item.name}`
    }));
  });

  function onSubmit(values: any) {
    if (resendEmaiLoading.value) {
      return;
    }

    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;
        error.value = false;

        if (renderMode.value == "login") {
          try {
            await loginRequest(values.userName, values.password);
            // closeDialog();
          } catch {}
        } else if (renderMode.value == "register") {
          try {
            await registerRequest(values);
            // closeDialog();
          } catch {}
        } else if (renderMode.value == "reset") {
          try {
            await recoverPassword(userName.value, values.password, values.otp);
            // renderMode.value = "login";
          } catch {}
        }
      }
    });
  }

  async function handleClick(itemName: string) {
    if (itemName == "forgetPassword") {
      userName.value = form.value.values.userName;
      if (userName.value == "") {
        error.value = true;
        message.value = messages.username_required;
      } else {
        error.value = false;

        //Call api and on succeed change rendermode
        try {
          await axios.post(`/MemberAuth/SendOtp/${userName.value}`);
          notify(t("auth.forgotPassword.otpMessage"), "positive");
          renderMode.value = "reset";
        } catch (e: any) {
          notify(e.message, "negative");
        }
      }
    }
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
