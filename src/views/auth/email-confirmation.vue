<template>
  <q-card class="text-center" flat style="height: 100vh">
    <q-card-section class="column full-height justify-center items-center">
      <q-avatar size="128px" square>
        <q-img :src="IMAGES.LOGO" />
      </q-avatar>

      <q-circular-progress
        v-if="loading"
        indeterminate
        size="90px"
        :thickness="0.2"
        color="primary"
        center-color="grey-3"
        track-color="transparent"
        class="q-ma-md"
      />
      <q-card-section v-else>
        <div class="text-h6">{{ $t("action.emailVerification") }}</div>
        <div v-if="error" class="text-subtitle2 text-red">{{ message }}</div>

        <template v-else>
          <p v-html="message"></p>
        </template>
        <q-btn @click="goToHome" outline color="primary">{{ $t("action.goToHome") }}</q-btn>
        <q-btn v-if="error" class="q-ml-sm" @click="resendLink" outline color="primary">{{
          $t("action.resendLink")
        }}</q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import axios, { AxiosError } from "axios";
  import { IMAGES, URL } from "@/constants";
  import i18n from "@/plugins/i18n/i18n";
  import { useRoute, useRouter } from "vue-router";

  const error = ref(false);
  const loading = ref(true);
  const message = ref("");
  const route = useRoute();
  const router = useRouter();
  const token = ref();
  const userId = ref();
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

  const confirmEmail = async () => {
    try {
      const response = await axios.get(
        `${URL.EMAIL_CONFIRMATION.CONFIRM_EMAIL}?token=${encodeURIComponent(token.value)}&userId=${userId.value}`
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
        `${URL.EMAIL_CONFIRMATION.RESEND_LINK}?userId=${userId.value}`
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
</script>
