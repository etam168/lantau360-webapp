<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    :maximized="$q.screen.lt.sm"
  >
    <q-layout
      view="lHh lpr lFf"
      style="max-width: 1024px"
      :class="{ 'bg-secondary': $q.screen.lt.sm }"
    >
      <q-page-container>
        <q-page class="column items-center justify-center q-pa-none">
          <q-card
            class="bg-secondary q-pt-none q-pa-md q-ma-none"
            :style="authStyle"
            :flat="$q.screen.lt.sm"
          >
            <q-btn
              :icon="fasXmark"
              flat
              round
              dense
              v-close-popup
              class="q-mr-md"
              v-if="$q.screen.gt.xs"
            />

            <template v-for="(item, index) in renderItems" :key="index">
              <auth-avatar v-if="item.type === 'avatar'" />
              <login
                v-if="item.type === 'login'"
                @close-dialog="closeDialog"
                @on-register="showRegister"
                @on-forgot-password="handleForgotPassword"
                @on-login-success="onLoginSuccess"
              />
              <register
                v-if="item.type === 'register'"
                @close-dialog="closeDialog"
                @on-login="showLogin"
              />
              <reset-password
                v-if="item.type === 'reset'"
                @close-dialog="closeDialog"
                @on-login="showLogin"
                :email="userName"
              />
            </template>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { fasXmark } from "@quasar/extras/fontawesome-v6";
  //Custom Components
  import Login from "./login.vue";
  import Register from "./register-tab.vue";
  import ResetPassword from "./reset-password-tab.vue";
  import AuthAvatar from "./auth-avatar.vue";

  // Props
  const { tabValue = "login", callback = null } = defineProps<{
    tabValue?: string;
    callback?: (() => void) | null;
  }>();

  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const { eventBus } = useUtilities();

  const $q = useQuasar();
  const isDialogVisible = ref(false);
  const currentTab = ref(tabValue);
  const userName = ref("");

  const authStyle = computed(() =>
    $q.screen.lt.sm ? { width: "100%", opacity: "100%" } : { width: "520px", opacity: "90%" }
  );

  const renderItems = computed(() => {
    switch (currentTab.value) {
      case "login":
        return [{ type: "avatar" }, { type: "login" }];
      case "register":
        return [{ type: "avatar" }, { type: "register" }];
      case "reset":
        return [{ type: "avatar" }, { type: "reset" }];
        break;
    }
  });

  function updateDialogState(status: boolean) {
    isDialogVisible.value = status;
  }

  function closeDialog() {
    setTimeout(() => {
      onDialogCancel();
    }, 1200);
  }

  function onLoginSuccess() {
    eventBus.emit("on-login-success");
    if (callback) callback();
  }

  function showRegister() {
    currentTab.value = "register";
  }

  function showLogin() {
    currentTab.value = "login";
  }

  function handleForgotPassword(value: string) {
    userName.value = value;
    currentTab.value = "reset";
  }
</script>
