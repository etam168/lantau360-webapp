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
                class="q-mb-sm"
              />

              <vee-input
                v-else-if="item.type === 'input'"
                :name="item.name"
                :label="item.label"
                class="q-mb-sm"
              />

              <vee-q-tel-input
                v-else-if="item.type === 'phone'"
                :name="item.name"
                class="q-mb-sm"
              />

              <app-button
                v-else-if="item.type === 'submit'"
                :label="$t(`${i18nKey}.button.${item.name}`)"
                @click="handleClick(item.name)"
              />

              <!-- type="submit" -->
              <app-button-auth-flat
                v-else-if="item.type === 'flatButton'"
                :label="$t(`${i18nKey}.button.${item.name}`)"
                @click="handleClick(item.name)"
              />
            </q-item-section>
          </q-item>

          <!-- <q-item-label v-if="error" class="text-red q-mt-md">{{ message }}</q-item-label> -->
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
  import { Form, useForm } from "vee-validate";

  // Emits
  const emits = defineEmits(["close-dialog"]);

  // Props
  const { mode } = defineProps<{
    mode: AuthMode;
  }>();

  const renderMode = ref(mode);

  const { t } = useI18n({ useScope: "global" });
  const { handleSubmit } = useForm();
  const { initialValues, schema, loginRequest, registerRequest, recoverPassword, sendOtp } =
    useAuthService(renderMode!);

  const $q = useQuasar();
  const form = ref();
  const loading = ref(false);
  const i18nKey = "auth";

  const authStyle = computed(() =>
    $q.screen.lt.sm ? { width: "100%", opacity: "100%" } : { width: "520px", opacity: "100%" }
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
            { name: "otp", type: "input" },
            { name: "newPassword", type: "password" },
            { name: "resetPassword", type: "submit" },
            { name: "signIn", type: "flatButton" }
          ];
        default:
          // Default is login
          return [
            { name: "userName", type: "input" },
            { name: "password", type: "password" },
            { name: "signIn", type: "submit" },
            { name: "forgotPassword", type: "flatButton" }
          ];
      }
    };

    return getItems().map(item => ({
      ...item,
      label: t(`${i18nKey}.label.${item.name}`)
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

        console.error("An error occurred:", error);

        //renderMode.value = renderMode.value == "sendOtp" ? "login" : renderMode.value;
        // Add more specific error handling here if needed
      } finally {
        loading.value = false;
      }
    }
  }

  function handleClick(itemName: string) {
    switch (itemName) {
      case "forgotPassword":
        renderMode.value = "sendOtp";
        handleSubmit(onSubmit)();
        break;

      case "signIn":
        renderMode.value = "login";
        handleSubmit(onSubmit)();
        break;

      case "register":
        renderMode.value = "register";
        handleSubmit(onSubmit)();
        break;
      // Other cases to be added
    }
  }
</script>
