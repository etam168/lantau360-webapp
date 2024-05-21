<template>
  <div class="email-verification">
    <div class="header">
      <q-avatar size="128px" square>
        <q-img :src="IMAGES.TRANSACTION_CANCELLED" />
      </q-avatar>
    </div>

    <p class="q-mt-lg" style="font-size: 16px; color: red" v-html="message"></p>
    <q-btn @click="goToHome" outline color="primary">{{ $t("action.goToHome") }}</q-btn>
  </div>
</template>

<script setup lang="ts">
  import i18n from "@/plugins/i18n/i18n";
  import { IMAGES } from "@/constants";

  const { t } = i18n.global;
  const router = useRouter();
  const message = ref(t("more.message.transactionCancelled"));

  const goToHome = () => {
    router.push("/");
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

  .q-btn {
    margin-top: 16px;
  }
</style>
