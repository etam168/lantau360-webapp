<template>
  <q-page class="q-pa-none column">
    <app-page-title>{{ $t("dashboard.title") }}</app-page-title>

    <q-card flat>
      <q-card-section class="q-pa-md row items-start q-gutter-md">
        <q-img
          class="col-2"
          v-for="galleries in gallery"
          :key="galleries"
          :src="galleries"
          :ratio="4 / 3"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent } from "vue";

  export default defineComponent({
    name: "DirectoryIndex",

    components: {
      AppPageTitle: defineAsyncComponent(() => import("@/components/widgets/app-page-title.vue"))
    },

    props: {
      props: {
        type: Object
      }
    },

    setup() {
      const gallery = [
        "https://cdn.quasar.dev/img/mountains.jpg",
        "https://cdn.quasar.dev/img/parallax1.jpg",
        "https://cdn.quasar.dev/img/parallax2.jpg",
        "https://cdn.quasar.dev/img/quasar.jpg",
        "https://cdn.quasar.dev/img/mountains.jpg",
        "https://cdn.quasar.dev/img/parallax1.jpg"
      ];
      return { gallery };
    }
  });
</script>
