<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    :maximized="$q.screen.lt.sm"
  >
    <q-layout
      view="lHh lpr lFf"
      style="max-width: 1024px"
      :class="{ 'bg-secondary': $q.screen.lt.sm }"
    >
      <q-page-container>
        <q-page class="column items-center justify-center q-pa-none">
          <q-card
            class="bg-secondary q-pt-none q-pa-md q-ma-none"
            :style="authStyle"
            :flat="$q.screen.lt.sm"
          >
            <q-btn
              :icon="fasXmark"
              flat
              round
              dense
              v-close-popup
              class="q-mr-md"
              v-if="$q.screen.gt.xs"
            />
            <Form
              ref="form"
              class="full-height"
              :initial-values="initialValues"
              :validation-schema="schema"
              @submit="onSubmit"
              v-slot="{ meta, values }"
            >
              <template v-for="(item, index) in renderItems" :key="index">
                <auth-avatar v-if="item.type === 'avatar'" />

                <vee-input
                  v-if="item.type === 'login'"
                  :label="$t('auth.login.userName')"
                  :icon="fasUser"
                  name="userName"
                  placeholder="user@example.com"
                  @update:model-value="onUpdateFormfield"
                />

                <vee-input-password
                  v-if="item.type === 'login'"
                  :label="$t('auth.login.password')"
                  name="password"
                  @update:model-value="onUpdateFormfield"
                />

                <app-button
                  v-if="item.type === 'login'"
                  :label="$t('auth.login.button')"
                  :loading="loading"
                  class="full-width"
                  color="primary"
                  type="submit"
                  size="md"
                />

                <q-card-actions v-if="item.type === 'login'" class="q-px-md q-py-sm bg-secondary">
                  <a href="#" @click="handleForgotPassword" class="forgot-password-link">
                    {{ $t("auth.login.forgotPassword") }}
                  </a>
                  <q-space />
                </q-card-actions>
                <!-- <login
                  v-if="item.type === 'login'"
                  @close-dialog="closeDialog"
                  @on-register="showRegister"
                  @on-forgot-password="handleForgotPassword"
                  @on-login-success="onLoginSuccess"
                /> -->

                <register
                  v-if="item.type === 'register'"
                  @close-dialog="closeDialog"
                  @on-login="showLogin"
                />
                <reset-password
                  v-if="item.type === 'reset'"
                  @close-dialog="closeDialog"
                  @on-login="showLogin"
                  :email="userName"
                />
              </template>
            </Form>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { fasXmark, fasUser } from "@quasar/extras/fontawesome-v6";
  import * as yup from "yup";
  import i18n from "@/plugins/i18n/i18n";
  import { Form } from "vee-validate";
  import { LocalStorage } from "quasar";
  import axios, { AxiosError } from "axios";

  //Custom Components
  import Login from "./login.vue";
  import Register from "./register-tab.vue";
  import ResetPassword from "./reset-password-tab.vue";
  import AuthAvatar from "./auth-avatar.vue";

  // .ts files
  import { useUserStore } from "@/stores/user";
  import { STORAGE_KEYS } from "@/constants";

  // Props
  const { tabValue = "login", callback = null } = defineProps<{
    tabValue?: string;
    callback?: (() => void) | null;
  }>();

  const emits = defineEmits(["close-dialog", "on-forgotPassword", "on-login-success"]);

  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const { eventBus } = useUtilities();
  const userStore = useUserStore();
  const { t } = i18n.global;
  const $q = useQuasar();
  const { notify } = useUtilities();
  const loading = ref(false);
  const isDialogVisible = ref(false);
  const currentTab = ref(tabValue);
  const userName = ref("");

  const form = ref();
  const shoulShowResendButton = ref(false);
  const resendEmaiLoading = ref(false);
  const error = ref(false);
  const message = ref("");

  const initialValues = ref({
    userName: "",
    password: ""
  });

  const schema = yup.object({
    userName: yup.string().required().label(t("auth.login.userName")),
    password: yup.string().required().min(4).label(t("auth.login.password"))
  });

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

  const renderItems = computed(() => {
    switch (currentTab.value) {
      case "login":
        return [{ type: "avatar" }, { type: "login" }];
      case "register":
        return [{ type: "avatar" }, { type: "register" }];
      case "reset":
        return [{ type: "avatar" }, { type: "reset" }];
        break;
    }
  });

  function updateDialogState(status: boolean) {
    isDialogVisible.value = status;
  }

  function closeDialog() {
    setTimeout(() => {
      onDialogCancel();
    }, 1200);
  }

  function onLoginSuccess() {
    eventBus.emit("on-login-success");
    if (callback) callback();
  }

  function showRegister() {
    currentTab.value = "register";
  }

  function showLogin() {
    currentTab.value = "login";
  }

  function handleForgotPassword(value: string) {
    userName.value = value;
    currentTab.value = "reset";
  }

  function onUpdateFormfield() {
    error.value = false;
  }

  function setFormValues(values: any) {
    userName.value = values.userName;
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
</script>
<style scoped>
  .forgot-password-link {
    color: green;
    text-decoration: underline;
    cursor: pointer;
    margin-right: 10px;
  }
</style>
