<template>
  <div class="email-verification">
    <div class="header">
      <q-avatar size="128px" square>
        <q-img :src="IMAGES.TRANACTION_SUCCESS" />
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
      <p v-if="error" class="error-message">{{ message }}</p>
      <template v-else>
        <p v-html="message"></p>
      </template>
      <q-btn @click="goToHome" outline color="primary">{{ $t("action.goToHome") }}</q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { URL, IMAGES } from "@/constants";
  import axios, { AxiosError } from "axios";
  import { useRoute } from "vue-router";
  import i18n from "@/plugins/i18n/i18n";
  import { useUserStore } from "@/stores/user";

  const points = ref();
  const amount = ref();

  const route = useRoute();
  const loading = ref(true);
  const error = ref(false);
  const router = useRouter();
  const { t } = i18n.global;

  const message = ref("");
  const { userId } = useUserStore();

  onMounted(() => {
    const query = route.query;
    points.value = query.points || null;
    amount.value = query.amount || null;

    if (points.value && amount.value) {
      postTransactionData();
    } else {
      error.value = true;
      message.value = t("more.message.invalidRequestData");
      loading.value = false;
    }
  });

  const goToHome = () => {
    router.push("/");
  };

  const postTransactionData = async () => {
    try {
      const data = {
        memberId: parseInt(userId),
        amount: amount.value,
        points: points.value,
        createdBy: parseInt(userId)
      };

      const response = await axios.post(`${URL.MEMBER_PURCHASE_TRANSACTIONS_URL}`, data);
      error.value = response.status !== 200;
      message.value = t("more.message.transactionSuccess");
    } catch (err: any) {
      alert(JSON.stringify(err));
      error.value = true;
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          message.value = t("errors.404");
        } else {
          message.value = t("errors.anErrorOccured");
        }
      } else {
        message.value = t("errors.anErrorOccured");
      }
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
