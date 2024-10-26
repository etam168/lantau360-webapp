<template>
  <q-card class="bg-secondary" :style="authStyle" :flat="$q.screen.lt.sm">
    <app-bar-dialog-close v-if="$q.screen.gt.xs" />
    <app-auth-avatar class="q-my-md" />

    <Form
      ref="form"
      class="full-height bg-transparent"
      :initial-values="initialValues"
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
              :hint="item.hint"
              class="q-mb-md"
            />

            <vee-input
              v-else-if="item.type === 'input'"
              :name="item.name"
              :label="item.label"
              :hint="item.hint"
              class="q-mb-md"
            />

            <vee-q-tel-input v-else-if="item.type === 'phone'" :name="item.name" class="q-mb-md" />

            <app-button
              v-else-if="item.type === 'submit'"
              :label="item.label"
              @click="handleClick(item.name)"
            />

            <app-button-timeout
              v-else-if="item.type === 'timeoutButton'"
              :label="item.label"
              @timeout-expired="onTimeoutExpired"
              @click="handleClick(item.name)"
            />

            <app-button-auth-flat
              v-else-if="item.type === 'flatButton'"
              :label="item.label"
              @click="handleClick(item.name)"
            />
          </q-item-section>
        </q-item>

        <!-- Filler to occupy space for small screen -->
        <div v-if="$q.screen.lt.sm && renderMode != 'register'" style="height: 25vh"></div>
      </q-list>
    </Form>
  </q-card>
</template>

<script setup lang="ts">
  // Types
  import type { AuthMode } from "@/interfaces/types/auth-mode";
  import type { SubField } from "@/interfaces/types/form-structure-types";

  // Composables
  import { Form, useForm } from "vee-validate";

  // Emits
  const emits = defineEmits(["close-dialog"]);

  // Props
  const { mode } = defineProps<{
    mode: AuthMode;
  }>();

  const renderMode = ref(mode);

  const { t } = useI18n({ useScope: "global" });
  const { eventBus } = useUtilities();
  const { handleSubmit } = useForm();
  const { initialValues, schema, loginRequest, registerRequest, recoverPassword, sendOtp } =
    useAuthService(renderMode!);

  const $q = useQuasar();
  const form = ref();
  const loading = ref(false);
  const i18nKey = "auth";
  const userName = ref();

  const authStyle = computed(() =>
    $q.screen.lt.sm ? { width: "100vw" } : { width: "520px", opacity: "100%" }
  );

  const renderItems = computed<SubField[]>(() => {
    const getItems = (): SubField[] => {
      switch (renderMode.value) {
        case "register":
          return [
            { name: "email", type: "input" },
            { name: "firstName", type: "input" },
            { name: "lastName", type: "input" },
            { name: "phone", type: "phone" },
            { name: "password", type: "password" },
            { name: "register", type: "submit" }
          ];
        case "reset":
          return [
            {
              name: "otp",
              type: "input",
              hint: t(`${i18nKey}.hint.otp`)
            },
            {
              name: "newPassword",
              type: "password",
              hint: t(`${i18nKey}.hint.newPassword`)
            },
            { name: "resetPassword", type: "timeoutButton" },
            { name: "backToSignIn", type: "flatButton" }
          ];
        default:
          // Default is login
          return [
            { name: "userName", type: "input", hint: "(Please enter your email)" },
            { name: "password", type: "password" },
            { name: "logon", type: "submit" },
            { name: "forgotPassword", type: "flatButton" }
          ];
      }
    };

    return getItems().map(item => ({
      ...item,
      label: item.label || t(`${i18nKey}.label.${item.name}`)
    }));
  });

  async function onSubmit(values: Record<string, any>) {
    const { validate } = form.value;
    const result = await validate();

    if (result.valid) {
      loading.value = true;

      try {
        switch (renderMode.value) {
          case "login":
            await loginRequest(values.userName, values.password);
            emits("close-dialog");
            break;
          case "register":
            await registerRequest(values);
            emits("close-dialog");
            break;
          case "reset":
            await recoverPassword(userName.value, values.password, values.otp);
            emits("close-dialog");
            break;
          case "sendOtp":
            await sendOtp(values.userName);
            // eventBus.emit("otpSent", "reset");
            eventBus("otpSent").emit("reset");


            //renderMode.value = "reset";
            break;
          default:
            throw new Error(`Unknown render mode: ${renderMode.value}`);
        }
      } catch (error) {
        // Handle all errors here
        console.error("An error occurred:", error);
        // Add more specific error handling here if needed
      } finally {
        loading.value = false;
      }
    }
  }

  function handleClick(itemName: string) {
    switch (itemName) {
      case "forgotPassword":
        userName.value = form.value.values.userName;
        onSubmit(form.value.values);
        renderMode.value = "sendOtp";
        break;

      case "backToSignIn":
        handleResetForm();
        renderMode.value = "login";
        break;

      case "resetPassword":
        onSubmit(form.value.values);
        break;

      case "logon":
      case "register":
        onSubmit(form.value.values);
        break;
      // Other cases to be added
    }
  }

  function handleResetForm() {
    if (form.value) {
      form.value.resetForm();
    }
  }

  onMounted(() => {
    eventBus("otpSent").on((mode: AuthMode) => {

      if (form.value) {
        form.value.resetForm();
      }
      renderMode.value = mode;
    });
  });

  function onTimeoutExpired() {
    renderMode.value = "login";
  }
</script>
