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
              icon="close"
              flat
              round
              dense
              v-close-popup
              class="q-mr-md"
              v-if="$q.screen.gt.xs"
            />

            <q-card-section align="center" class="q-pa-none">
              <!-- Move the avatar to the center -->
              <div class="q-mb-md text-h6 q-gutter-md">
                <q-avatar size="128px" square>
                  <q-img :src="logo" />
                </q-avatar>
              </div>
            </q-card-section>

            <q-tabs v-model="tab" class="text-transparent hidden">
              <q-tab name="login" />
              <q-tab name="register" />
            </q-tabs>

            <q-tab-panels v-model="tab" animated class="q-pa-none">
              <q-tab-panel name="login" class="q-pa-none">
                <Login
                  @close-dialog="closeDialog"
                  @on-register="showRegister"
                  @on-forgot-password="handleForgotPassword"
                  @on-login-success="onLoginSuccess"
                />
              </q-tab-panel>
              <q-tab-panel name="register" class="q-pa-none">
                <Register @close-dialog="closeDialog" @on-login="showlogin" />
              </q-tab-panel>
              <q-tab-panel class="q-pa-none" name="reset">
                <ResetPassword
                  @close-dialog="closeDialog"
                  @on-login="showlogin"
                  :email="userName"
                />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  //Custom Components
  import Login from "./login.vue";
  import Register from "./register-tab.vue";
  import ResetPassword from "./reset-password-tab.vue";

  const props = defineProps({
    tabValue: {
      type: String,
      default: "login"
    },
    callback: {
      type: Function,
      default: null
    }
  });

  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const { eventBus } = useUtilities();

  const $q = useQuasar();
  const logo = ref("/img/logo/logo.png");
  const isDialogVisible = ref();
  const tab = ref(props.tabValue);
  const userName = ref();
  const authStyle = computed(() =>
    $q.screen.lt.sm ? { width: "100%", opacity: "100%" } : { width: "520px", opacity: "90%" }
  );

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
  }
  const closeDialog = () => {
    setTimeout(() => {
      onDialogCancel();
    }, 1200);
  };

  function onLoginSuccess() {
    eventBus.emit("on-login-success");
    if (props.callback != null) props.callback();
  }

  function showRegister() {
    tab.value = "register";
  }

  function showlogin() {
    tab.value = "login";
  }

  function handleForgotPassword(value: any) {
    userName.value = value;
    tab.value = "reset";
  }
</script>

<style scoped>
  .bg-image {
    background: url("@/assets/img/logon-bg-lantau.jpg");
    background-size: cover;
    background-position: center center;
  }
  .q-tab {
    cursor: default !important;
    pointer-events: none;
  }
</style>
