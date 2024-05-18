<template>
  <div class="email-verification">
    <div class="header">
      <q-avatar size="128px" square>
        <q-img :src="img" />
      </q-avatar>
    </div>

    <p class="q-mt-lg" style="font-size: 16px; color: red" v-html="message"></p>
    <q-btn @click="goToHome" outline color="primary">{{ $t("action.goToHome") }}</q-btn>
  </div>
</template>

<script setup lang="ts">
  const img = ref("/img/icons/transaction_cancelled.png");

  const router = useRouter();

  const message = ref("Transaction request Cancelled");

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
