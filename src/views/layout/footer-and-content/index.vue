<template>
  <q-footer bordered class="bg-grey-3 text-primary">
    <q-btn-toggle
      v-model="menuNav"
      toggle-color="primary"
      flat
      size="16px"
      text-color="grey-10"
      style="width: 100%"
      class="justify-center"
      :options="[
        { label: $t('layout.menu.dashboard'), value: 'dashboard' },
        { label: $t('layout.menu.members'), value: 'members' },
        { label: $t('layout.menu.staff'), value: 'staff' },
        { label: $t('layout.menu.directories'), value: 'directories' },
        { label: $t('layout.menu.weather'), value: 'weather' },
        { label: $t('layout.menu.businesses'), value: 'businesses' },
        { label: $t('layout.menu.sites'), value: 'sites' }
      ]"
      @update:model-value="handleToggleUpdate"
    />
  </q-footer>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";
  import { useRouter } from "vue-router";

  const router = useRouter();
  const menuNav = ref("");

  const handleToggleUpdate = (newVal: any) => {
    switch (newVal) {
      case "dashboard":
        router.push("/dashboard");
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
