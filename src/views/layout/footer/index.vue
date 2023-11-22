<template>
  <q-footer bordered class="bg-grey-3 text-primary">
    <q-tabs
      v-model="tab"
      active-color="primary"
      class="bg-indigo text-white"
      indicator-color="transparent"
      no-caps
    >
      <!-- <q-tab name="home" icon="img:/img/logo/logo.png" label="Home" /> -->
      <q-tab name="home" icon="fas fa-home" label="Home" @click="navigateTo('/home')" />
      <q-tab
        name="business"
        icon="fa-solid fa-money-check-dollar"
        label="Business"
        @click="navigateTo('/staff')"
      />
      <q-tab
        name="community"
        icon="fa-solid fa-people-group"
        label="Community"
        @click="navigateTo('/directories')"
      />
      <q-tab
        name="favourites"
        icon="fa-solid fa-heart"
        label="Favourites"
        @click="navigateTo('/weather')"
      />
      <q-tab name="more" icon="fa-solid fa-ellipsis" label="More" @click="navigateTo('/staff')" />
    </q-tabs>
  </q-footer>
</template>

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";
  import { useRouter } from "vue-router";

  const router = useRouter();
  const menuNav = ref("");

  const tab = ref("mails");

  const navigateTo = (route: string) => {
    router.push(route);
  };

  const handleToggleUpdate = (newVal: any) => {
    switch (newVal) {
      case "home":
        router.push("/home");
        break;
      case "staff":
        router.push("/staff");
        break;
      case "members":
        router.push("/members");
        break;
      case "directories":
        router.push("/directories");
        break;
      case "weather":
        router.push("/weather");
        break;
      case "businesses":
        router.push("/businesses");
        break;
      case "sites":
        router.push("/sites");
        break;
      default:
        break;
    }
  };
</script>
