<template>
  <vee-form
    ref="form"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="onSubmit"
    v-slot="{ meta }"
  >
    <q-card-section>
      <app-input-password
        :disable="remainingTime <= 0 && !loading"
        :label="$t('auth.login.password')"
        name="password"
      />
      <app-input-password
        :disable="remainingTime <= 0 && !loading"
        :label="$t('auth.login.confirmPassword')"
        name="confirmPassword"
      />

      <div v-if="remainingTime > 0" class="countdown-container text-right">
        <span v-if="remainingTime > 60" class="minutes">{{ Math.floor(remainingTime / 60) }}:</span>
        <span :style="{ color: remainingTime <= 10 ? 'red' : 'inherit' }" class="seconds">
          {{ remainingTime > 60 ? remainingTime % 60 : remainingTime }}
          <span v-if="remainingTime <= 10" class="countdown-warning">!</span>
        </span>
      </div>

      <div v-if="remainingTime <= 0 && !loading" class="countdown-warning-message text-center">
        Link is expired. Please request a new password reset link.
      </div>
    </q-card-section>

    <q-card-actions class="q-pa-none">
      <app-button
        label="Update"
        :loading="loading"
        class="full-width"
        color="primary"
        type="submit"
        size="lg"
        :disabled="!(meta.valid && meta.dirty)"
      />
    </q-card-actions>
  </vee-form>
</template>

<script setup lang="ts">
  // Vue Import
  import { onMounted, ref } from "vue";

  // .ts files
  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import AppInputPassword from "@/components/widgets/app-input-password.vue";
  import axios, { AxiosError } from "axios";
  import { useUtilities } from "@/composable/use-utilities";
  import { useRouter } from "vue-router";

  const form = ref();
  const { notify } = useUtilities();
  const remainingTime = ref(0);
  const ttlInSeconds = 2 * 60; // 2 mins

  const schema = {
    password: "required|min:3|max:100",
    confirmPassword: "passwords_mismatch:@password"
  };

  const initialValues = ref({
    password: "",
    confirmPassword: ""
  });
  const error = ref<string | null>(null);
  const router = useRouter();
  const uuid = ref("");
  const loading = ref(false);

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        updatePassword(uuid.value, values.password);
      }
    });
  }

  onMounted(() => {
    const { query } = router.currentRoute.value;
    if (query?.user !== undefined) {
      uuid.value = query.user?.toString() ?? "";
    }
    loadResetPasswordRequest();
  });

  async function loadResetPasswordRequest() {
    try {
      loading.value = true;
      await axios.get(`/StaffAuth/GetPasswordChangeRequestData/${uuid.value}`).then(response => {
        if (response.status == 200) {
          const parsedDate = new Date(response.data.createdAt);
          const currentDate = new Date();
          const timeDifferenceInMilliseconds = currentDate.getTime() - parsedDate.getTime();
          const differenceInSeconds = timeDifferenceInMilliseconds / 1000;

          if (differenceInSeconds <= ttlInSeconds) {
            remainingTime.value = ttlInSeconds - Math.floor(differenceInSeconds);

            const countdownInterval = setInterval(() => {
              remainingTime.value--;
              if (remainingTime.value <= 0) {
                clearInterval(countdownInterval);
              }
            }, 1000);
          }
        }
      });
    } catch (e: any) {
      console.log("");
    }
    loading.value = false;
  }

  async function updatePassword(uuid: string, password: string) {
    if (remainingTime.value <= 0) {
      return;
    }
    loading.value = true;
    await axios
      .put(`/StaffAuth/ResetPasswordByUuid/${uuid}?password=${password}`)
      .then(() => {
        router.push("/");

        notify("Password update successfully", "positive");
      })
      .catch(error => {
        handleError(error);
      });
    loading.value = false;
  }

  function handleError(err: any) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.status === 404) {
        error.value = "Not found";
      } else {
        error.value = "An error occurred";
      }
    } else {
      error.value = "An unexpected error occurred";
    }
  }
</script>

<style scoped>
  .countdown-container {
    font-size: 24px;
    align-self: right;
  }

  .minutes {
    font-size: 18px;
  }

  .seconds {
    font-size: 24px;
    display: inline-block;
  }

  .countdown-warning {
    color: red;
  }

  .countdown-warning-message {
    text-align: center;
    color: red;
  }
</style>
