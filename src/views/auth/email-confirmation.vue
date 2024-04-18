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
    <div class="verification-message" v-else-if="error">
      <h2>Email Verification</h2>
      <p class="error-message">An error occurred while verifying your email.</p>
      <p>Please try with a new link.</p>
      <q-btn @click="goToHome" outline color="primary">Go to Home</q-btn>
    </div>
    <div class="verification-message" v-else>
      <h2>Email Verification</h2>
      <p>Thank you for verifying your email address.</p>
      <p>Your email has been successfully verified.</p>
      <q-btn @click="goToHome" outline color="primary">Go to Home</q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { URL } from "@/constants";
  import axios from "axios";
  import { useRoute } from "vue-router";

  const logo = ref("/img/logo/logo.png");
  const token = ref();
  const userId = ref();
  const route = useRoute();
  const loading = ref(true);
  const error = ref(false);
  const router = useRouter();

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

  const confirmEmail = async () => {
    try {
      const response = await axios.get(
        `${URL.EMAIL_CONFIRMATION.CONFIRM_EMAIL}?token=${token.value}&userId=${userId.value}`
      );
      error.value = response.status !== 200;
    } catch {
      error.value = true;
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
