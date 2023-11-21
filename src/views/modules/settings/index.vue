<template>
  <q-page class="bg-grey-2 column" style="max-width: 960px">
    <app-page-title>{{ $t("settings.title") }}</app-page-title>
    <q-separator />

    <suspense>
      <template #default> <setting-page /> </template>
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
  import { defineAsyncComponent } from "vue";
  import AppSpinner from "@/components/widgets/app-spinner.vue";

  const AppPageTitle = defineAsyncComponent(
    () => import("@/components/widgets/app-page-title.vue")
  );

  const SettingPage = defineAsyncComponent({
    loader: () => import("./setting-page.vue"),
    delay: 500
  });
</script>
