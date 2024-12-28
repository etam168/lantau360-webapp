<template>
  <div class="email-verification">
    <div class="header">
      <q-avatar size="128px" square>
        <q-img :src="logo" />
      </q-avatar>
    </div>
    <div v-if="loading">
      <q-circular-progress
        indeterminate
        size="90px"
        :thickness="0.2"
        color="primary"
        center-color="grey-3"
        track-color="transparent"
        class="q-ma-md"
      />
    </div>
    <div class="verification-message" v-else>
      <h2>{{ $t("action.emailVerification") }}</h2>
      <p v-if="error" class="error-message">{{ message }}</p>
      <template v-else>
        <p v-html="message"></p>
      </template>
      <q-btn @click="goToHome" outline color="primary">{{ $t("action.goToHome") }}</q-btn>
      <q-btn v-if="error" class="q-ml-sm" @click="resendLink" outline color="primary">{{
        $t("action.resendLink")
      }}</q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ENTITY_URL } from "@/constants";
  import axios, { AxiosError } from "axios";
  import { useRoute } from "vue-router";
  import i18n from "@/plugins/i18n/i18n";

  const logo = ref("/img/logo/logo.png");
  const token = ref();
  const userId = ref();
  const route = useRoute();
  const loading = ref(true);
  const error = ref(false);
  const router = useRouter();
  const { t } = i18n.global;

  const messages: any = {
    token_or_userid_missing: t("auth.emailMessages.tokenOrUseridMissing"),
    invalid_user: t("auth.emailMessages.invalidUser"),
    invalid_token: t("auth.emailMessages.invalidToken"),
    token_expired: t("auth.emailMessages.tokenExpired"),
    email_confirmation_failed: t("auth.emailMessages.emailConfirmationFailed"),
    email_send_failed: t("auth.emailMessages.emailSendFailed"),
    email_sent_successfully: t("auth.emailMessages.emailSentSuccessfully"),
    email_already_verified: t("auth.emailMessages.emailAlreadyVerified"),
    confimation_sucessfull: t("auth.emailMessages.confimationSucessfull")
  };

  const message = ref("");

  onMounted(() => {
    const query = route.query;
    token.value = query.token || null;
    userId.value = query.userId || null;
    if (token.value && userId.value) {
      confirmEmail();
    } else {
      loading.value = false;
    }
  });

  const goToHome = () => {
    router.push("/");
  };

  const handleAxiosError = (err: AxiosError) => {
    if (err.response) {
      const { data } = err.response;
      if (data === "email_already_verified") {
        error.value = false;
      }
      message.value = messages[data as string] || messages.email_confirmation_failed;
    } else {
      message.value = messages.email_confirmation_failed;
      error.value = true;
    }
  };

  const resendLink = async () => {
    try {
      if (!userId) {
        message.value = messages.invalid_user;
        return;
      }
      loading.value = true;
      const response = await axios.post(
        `${ENTITY_URL.EMAIL_CONFIRMATION.RESEND_LINK}?userId=${userId.value}`
      );
      error.value = response.status !== 200;
      message.value = messages.email_sent_successfully;
    } catch (err: any) {
      error.value = true;
      handleAxiosError(err);
    } finally {
      loading.value = false;
    }
  };

  const confirmEmail = async () => {
    try {
      const response = await axios.get(
        `${ENTITY_URL.EMAIL_CONFIRMATION.CONFIRM_EMAIL}?token=${encodeURIComponent(token.value)}&userId=${userId.value}`
      );
      error.value = response.status !== 200;
      message.value = messages.confimation_sucessfull;
    } catch (err: any) {
      error.value = true;
      handleAxiosError(err);
    } finally {
      loading.value = false;
    }
  };
</script>

<style scoped>
  .email-verification {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90vh;
  }

  .header {
    text-align: center;
  }

  .verification-message {
    text-align: center;
  }

  .verification-message h2 {
    font-size: 24px;
    margin-bottom: 16px;
  }

  .verification-message p {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .error-message {
    color: red;
  }

  .q-btn {
    margin-top: 16px;
  }
</style>
