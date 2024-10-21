<!-- auth-avatar.vue -->
<template>
    <q-card-section align="center" class="q-pa-none">
      <div class="q-mb-md text-h6 q-gutter-md">
        <q-avatar size="128px" square>
          <q-img :src="IMAGES.LOGO" />
        </q-avatar>
      </div>
    </q-card-section>
  </template>
  
  <script setup lang="ts">
  import { IMAGES } from "@/constants";
  </script>