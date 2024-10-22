<template>
  <q-page class="column items-center justify-center">
    <q-card class="bg-secondary" :style="authStyle" :flat="$q.screen.lt.sm">
      <app-bar-dialog-close v-if="$q.screen.gt.xs" />
      <app-auth-avatar class="q-my-md" />

      <Form
        ref="form"
        class="full-height bg-transparent"
        :initial-values="initialValues"
        :validation-schema="schema"
        @submit="onSubmit"
        v-slot="{ meta, values }"
      >
        <q-list class="q-pa-md">
          <q-item v-for="(item, index) in renderItems" :key="index" dense>
            <q-item-section>
              <vee-input-password
                v-if="item.type === 'password'"
                :name="item.name"
                :label="item.label"
              />

              <app-button v-else-if="item.type === 'submit'" :label="item.label" type="submit" />
              <vee-input v-else-if="item.type === 'input'" :name="item.name" :label="item.label" />
              <vee-q-tel-input v-else-if="item.type === 'phone'" :name="item.name" />

              <div v-else-if="item.type === 'flatButton'">
                <app-button-flat :label="item.label" @click="handleClick(item.name)" />
              </div>
            </q-item-section>
          </q-item>

          <q-item-label v-if="error" class="text-red q-mt-md">{{ message }}</q-item-label>
        </q-list>
      </Form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  // Types
  import type { AuthMode } from "@/interfaces/types/auth-mode";
  import type { SubField } from "@/interfaces/types/form-structure-types";

  // Composables
  import { Form } from "vee-validate";

  // Emits
  const emits = defineEmits(["close-dialog", "on-forgotPassword", "on-login-success"]);

  // Props
  const { mode } = defineProps<{
    mode?: AuthMode;
  }>();

  const { initialValues, schema, loginRequest, registerRequest, recoverPassword, sendOtp } =
    useAuthService();

  const $q = useQuasar();
  const form = ref();
  const loading = ref(false);
  const resendEmaiLoading = ref(false);
  const message = ref("");
  const i18nKey = "auth";
  const error = ref(false);

  const authStyle = computed(() =>
    $q.screen.lt.sm ? { width: "100%", opacity: "100%" } : { width: "520px", opacity: "100%" }
  );

  const renderMode = ref(mode);

  const renderItems = computed<SubField[]>(() => {
    const getItems = (): SubField[] => {
      switch (renderMode.value) {
        case "register":
          return [
            { name: "userName", type: "input" },
            { name: "firstName", type: "input" },
            { name: "lastName", type: "input" },
            { name: "phone", type: "phone" },
            { name: "password", type: "password" },
            { name: "register", type: "submit" }
          ];
        case "reset":
          return [
            { name: "otp", type: "input" },
            { name: "password", type: "password" },
            { name: "resetPassword", type: "submit" }
          ];
        default:
          // Default is login
          return [
            { name: "userName", type: "input" },
            { name: "password", type: "password" },
            { name: "signIn", type: "submit" },
            { name: "forgetPassword", type: "flatButton" }
          ];
      }
    };

    return getItems().map(item => ({
      ...item,
      label: `${i18nKey}.${item.name}`
    }));
  });

  async function onSubmit(values: Record<string, any>) {
    if (resendEmaiLoading.value) {
      return;
    }

    const { validate } = form.value;
    const result = await validate();
    const savedMode = renderMode.value;

    if (result.valid) {
      loading.value = true;
      error.value = false;

      try {
        switch (renderMode.value) {
          case "login":
            await loginRequest(values.userName, values.password);
            break;
          case "register":
            await registerRequest(values);
            break;
          case "reset":
            await recoverPassword(values.userName, values.password, values.otp);
            break;
          case "sendOtp":
            await sendOtp(values.userName);
            renderMode.value = "reset";
            break;
          default:
            throw new Error(`Unknown render mode: ${renderMode.value}`);
        }
      } catch (error) {
        // Handle all errors here
        renderMode.value = savedMode;
        console.error("An error occurred:", error);
        // You can add more specific error handling here if needed
      } finally {
        loading.value = false;
      }
    }
  }

  async function handleClick(itemName: string) {
    switch (itemName) {
      case "forgetPassword":
        renderMode.value = "sendOtp";
        form.value.submitForm();
        break;
      // Other cases to be added
    }
  }
</script>
