<!-- error-404.vue -->
<template>
  <q-card flat square tile class="mx-auto mt-8 mb-2 pb-8 row justify-center">
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 100vh; max-width: 1024px; background-color: #f6f6f6"
      class="shadow-2 rounded-borders"
    >
      <q-page-container>
        <q-page>
          <div class="text-center row items-center justify-center q-pa-md">
            <div>
              <div class="text-h3">{{ $t("errors.weAreSorry") }}</div>
              <q-img ratio="1" :src="NO_INTERNET" />
              <div class="text-h5">{{ $t("errors.noInternetConnection") }}</div>
              <div class="text-body2" style="opacity: 0.7">
                {{ $t("errors.seemsInternetConnection") }}
              </div>
              <div class="text-body2" style="opacity: 0.7">
                {{ $t("errors.pleaseCheckConnection") }}
              </div>
              <q-btn to="/" outline rounded color="primary" class="q-mt-md">{{
                $t("errors.retry")
              }}</q-btn>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-card>
</template>

<script setup lang="ts">
  import { NO_INTERNET } from "@/constants";
</script>
