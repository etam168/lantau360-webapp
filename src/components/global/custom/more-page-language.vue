<!-- more-page-language.vue -->
<template>
  <q-item class="shadow-1">
    <q-item-section avatar>
      <q-avatar square :icon="ICONS.SETTING" font-size="36px"></q-avatar>
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
</template>

<script setup lang="ts">
  import { ICONS } from "@/constants/app/image-icon";
</script>
