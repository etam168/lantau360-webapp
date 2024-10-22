<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" style="max-width: 1024px">
      <q-page-container>
        <q-page class="column items-center justify-center">
          <q-card class="bg-secondary q-dialog-plugin">
            <q-btn :icon="fasXmark" flat round dense v-close-popup />

            <app-auth-avatar />

            <Form
              ref="form"
              class="full-height"
              :initial-values="initialValues"
              :validation-schema="schema"
              @submit="onSubmit"
              v-slot="{ meta, values }"
            >
              <q-list class="q-mx-md">
                <q-item v-for="(item, index) in renderItems" :key="index" dense>
                  <q-item-section>
                    <vee-input-password
                      v-if="item.type === 'password'"
                      :name="item.name"
                      :label="$t('auth.login.password')"
                    />

                    <app-button v-if="item.type === 'submit'" :label="item.label" type="submit" />

                    <app-button-flat
                      v-if="item.type === 'flatButton'"
                      :label="item.label"
                      @click="handleClick(item.name)"
                      class="bg-red"
                    />

                    <vee-q-tel-input
                      v-if="item.type === 'phone'"
                      :name="item.name"
                      defaultIso="HK"
                    />

                    <vee-input v-if="item.type === 'input'" :name="item.name" :label="item.label" />
                  </q-item-section>
                </q-item>
              </q-list>
            </Form>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { fasXmark } from "@quasar/extras/fontawesome-v6";
  import * as yup from "yup";
  import { Form } from "vee-validate";

  // .ts files
  import { SubField } from "@/interfaces/types/form-structure-types";

  // Props
  const { mode = "login" } = defineProps<{
    mode?: AuthMode;
  }>();

  type AuthMode = "login" | "register" | "reset";

  const emits = defineEmits(["close-dialog", "on-forgotPassword", "on-login-success"]);

  // const { loginRequest, registerRequest, recoverPassword } = useAuthService();
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const $q = useQuasar();
  const isDialogVisible = ref(false);

  const form = ref();
  const i18nKey = "auth";

  const initialValues = ref({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    otp: ""
  });

  const schema = yup.object({
    // otp:  yup.string().required().label(t("auth.login.userName")),
    // userName: yup.string().required().label(t("auth.login.userName")),
    // password: yup.string().required().min(4).label(t("auth.login.password"))
  });

  const authStyle = computed(() =>
    $q.screen.lt.sm ? { width: "100%", opacity: "100%" } : { width: "520px", opacity: "90%" }
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

  function updateDialogState(status: boolean) {
    isDialogVisible.value = status;
  }

  function closeDialog() {
    setTimeout(() => {
      onDialogCancel();
    }, 1200);
  }

  async function onSubmit(values: any) {
    const { validate } = form.value;
    const result = await validate();

    if (result.valid) {
      switch (renderMode.value) {
        case "register":
          handleRegister();
          alert("register mode");
          break;
        case "login":
          alert("login mode");
          break;
      }
    }
  }

  function handleRegister() {}

  async function handleClick(itemName: string) {
    renderMode.value = "reset";
  }
</script>

<style scoped>
  .forgot-password-link {
    color: green;
    text-decoration: underline;
    cursor: pointer;
    margin-right: 10px;
  }
</style>
