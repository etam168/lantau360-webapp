<template>
  <q-page class="q-pa-none column">
    <q-card flat class="text-center">
      <q-avatar size="128px"> <img :src="logo" /></q-avatar>
      <app-card-text>{{ version }}</app-card-text>
    </q-card>
  </q-page>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from "vue";
  import { AppVersion } from "@/constants";

  import AppCardText from "@/components/widgets/app-card-text.vue";

  export default defineComponent({
    name: "VersionIndex",

    components: {
      AppCardText
    },

    setup() {
      const logo = ref("/img/logo/logo.png");

      const version = computed(() => {
        return `Version ${AppVersion}`;
      });

      return {
        logo,
        version
      };
    }
  });
</script>
