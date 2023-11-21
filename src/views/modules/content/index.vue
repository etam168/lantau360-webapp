<template>
  <q-page class="bg-grey-2 q-pb-sm" style="max-width: 960px">
    <app-page-title>{{ $t(`content.title.${contentName}`) }}</app-page-title>
    <q-separator />

    <suspense>
      <template #default>
        <content-input :contentName="contentName" />
      </template>
      <template #fallback>
        <div class="row justify-center items-center" style="height: 500px">
          <app-spinner size="10em" />
        </div>
      </template>
    </suspense>
  </q-page>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed, defineAsyncComponent } from "vue";
  import { useRoute } from "vue-router";

  import AppSpinner from "@/components/widgets/app-spinner.vue";

  const AppPageTitle = defineAsyncComponent(
    () => import("@/components/widgets/app-page-title.vue")
  );

  const ContentInput = defineAsyncComponent({
    loader: () => import("./content-input.vue"),
    delay: 500
  });

  // Access the route and retrieve the contentName parameter
  const route = useRoute();
  const queryParam = route.meta.queryParam as string;

  // Create a computed property for contentName
  const contentName = computed(() => {
    switch (queryParam) {
      case "Terms":
      case "Privacy":
      case "About":
        return queryParam;
      default:
        return "default";
    }
  });
</script>
