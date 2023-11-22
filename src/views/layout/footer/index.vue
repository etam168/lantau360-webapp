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
      <q-tab name="home" icon="fas fa-home" label="Home" />
      <q-tab name="business" icon="fa-solid fa-money-check-dollar" label="Business" />
      <q-tab name="community" icon="fa-solid fa-people-group" label="Community" />
      <q-tab name="favourites" icon="fa-solid fa-heart" label="Favourites" />
      <q-tab name="more" icon="fa-solid fa-ellipsis" label="More" />
    </q-tabs>

    <!-- <q-btn-toggle
      v-model="menuNav"
      toggle-color="primary"
      flat
      size="16px"
      text-color="grey-10"
      style="width: 100%"
      class="justify-center"
      :options="[
        { value: 'home', slot: 'home' },
        { value: 'members', slot: 'members' },
        { value: 'staff', slot: 'staff' },
        { value: 'directories', slot: 'directories' },
        { value: 'weather', slot: 'weather' }
      ]"
      @update:model-value="handleToggleUpdate"
    >
      <template v-slot:home>
        <q-item>
          <q-item-section top class="text-center row items-center">
            <q-item-label caption>Home</q-item-label>
            <q-icon name="home" color="yellow" />
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:members>
        <q-item>
          <q-item-section top class="text-center row items-center">
            <q-item-label caption>Business</q-item-label>
            <q-icon name="home" color="yellow" />
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:staff>
        <q-item>
          <q-item-section top class="text-center row items-center">
            <q-item-label caption>Community</q-item-label>
            <q-icon name="home" color="yellow" />
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:directories>
        <q-item>
          <q-item-section top class="text-center row items-center">
            <q-item-label caption>Favourites</q-item-label>
            <q-icon name="home" color="yellow" />
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:weather>
        <q-item>
          <q-item-section top class="text-center row items-center">
            <q-item-label caption>More</q-item-label>
            <q-icon name="home" color="yellow" />
          </q-item-section>
        </q-item>
      </template>
    </q-btn-toggle> -->
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
