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
      <h2>Email Verification</h2>
      <p v-if="error" class="error-message">{{ message }}</p>
      <template v-else>
        <p v-html="message"></p>
      </template>
      <q-btn @click="goToHome" outline color="primary">Go to Home</q-btn>
      <q-btn v-if="error" class="q-ml-sm" @click="resendLink" outline color="primary"
        >Resend Link</q-btn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { URL } from "@/constants";
  import axios, { AxiosError } from "axios";
  import { useRoute } from "vue-router";

  const logo = ref("/img/logo/logo.png");
  const token = ref();
  const userId = ref();
  const route = useRoute();
  const loading = ref(true);
  const error = ref(false);
  const router = useRouter();

  const messages: any = {
    token_or_userid_missing: "Invalid link, please resend the link to verify",
    invalid_user: "Invalid data, please provide the correct data",
    invalid_token: "Invalid link, please resend the link to verify",
    token_expired: "The link has expired, please try with a new link",
    email_confirmation_failed: "Email confirmation failed, please try with a new link",
    email_send_failed: "Unable to send email, please try again",
    email_sent_successfully: "Please check your email for the confirmation link",
    email_already_verified: "Your email is already verified",
    confimation_sucessfull:
      "Thank you for verifying your email address.\nYour email has been successfully verified."
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
