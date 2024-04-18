<template>
  <h3>Confirm your email</h3>
  <h5>
    Verifying your email gives you access to more features. Click the button below to complete the
    process
  </h5>
  <q-chip clickable outline color="primary" text-color="white" @click="ConfirmEmail()">
    {{ "Confirm Email" }}
  </q-chip>
</template>

<script setup lang="ts">
  import { useRouter } from "vue-router";
  const router = useRouter();
  const $q = useQuasar();

  const token = ref();
  const userId = ref();

  onMounted(() => {
    const { query } = router.currentRoute.value;
    if (query?.token !== undefined && query.userId !== undefined) {
      debugger;
      token.value = decodeURIComponent(query?.token);
      userId.value = query.userId;
    }
  });

  async function ConfirmEmail() {
    try {
      const response = await axios.get(
        `/MemberAuth/VerifyEmail?token=${encodeURIComponent(token.value)}&userId=${userId.value}`
      );
      console.log(response);
      // isEmailSent.value = true;
      // emits("on-forgotPassword", userName.value);
      $q.notify({
        message: "Email verified",
        type: "positive"
      });
      router.push("/home");
    } catch (e: any) {
      $q.notify({
        message: e.message,
        type: "negative"
      });
    }
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
