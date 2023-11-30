<template>
  <q-footer bordered class="bg-white text-primary">
    <q-tabs
      v-model="tab"
      active-color="primary"
      align="justify"
      class="text-grey"
      indicator-color="transparent"
      mobile-arrows
      dense
      no-caps
    >
      <q-tab
        name="home"
        icon="fas fa-home"
        :label="$t('footer.home')"
        @click="navigateTo('/home')"
      />
      <q-tab
        name="business"
        icon="fa-solid fa-money-check-dollar"
        :label="$t('footer.business')"
        @click="navigateTo('/businesses')"
      />
      <q-tab
        name="community"
        icon="fa-solid fa-people-group"
        :label="$t('footer.community')"
        @click="navigateTo('/community')"
      />
      <q-tab
        name="favourites"
        icon="fa-solid fa-heart"
        :label="$t('footer.favourite')"
        @click="navigateTo('/favourites')"
      />
      <q-tab
        name="more"
        icon="fa-solid fa-ellipsis"
        :label="$t('footer.more')"
        @click="navigateTo('/more')"
      />
    </q-tabs>
  </q-footer>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";
  import { useRouter } from "vue-router";

  const router = useRouter();
  const tab = ref("home");

  const navigateTo = (route: string) => {
    router.push(route);
  };
</script>
