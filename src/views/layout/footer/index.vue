<template>
  <q-footer bordered class="bg-white text-primary">
    <q-tabs
      v-if="$q.screen.gt.sm"
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
    </q-tabs>
    <!-- For small screen -->
    <q-tabs
      v-else
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
      <q-btn-dropdown auto-close stretch flat>
        <template v-slot:label>
          <div>
            <div class="row justify-around items-center no-wrap">
              <q-icon name="fa-solid fa-ellipsis" />
            </div>
            <div class="row items-center no-wrap">
              {{ $t("footer.more") }}
            </div>
          </div>
        </template>

        <q-list>
          <q-item clickable @click="navigateTo('/favourites')">
            <q-item-section>{{ $t("footer.favourite") }}</q-item-section>
          </q-item>

          <q-item clickable @click="navigateTo('/more')">
            <q-item-section>{{ $t("footer.more") }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
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
