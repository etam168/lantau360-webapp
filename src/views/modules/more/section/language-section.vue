<!-- MenuSection.vue -->
<template>
  <q-card-section class="q-pt-none q-qb-xl">
    <q-item class="shadow-1 q-mb-md q-pl-sm">
      <q-item-section avatar>
        <q-avatar size="36px" square>
          <img :src="ICONS.SETTING" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-medium">
          {{ $t("more.language") }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <language-select />
      </q-item-section>
    </q-item>
  </q-card-section>
</template>

<script setup lang="ts">
  import { ICONS } from "@/constants/app/image-icon";
</script>
