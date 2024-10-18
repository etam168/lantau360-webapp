<!-- MenuSection.vue -->
<template>
  <q-item class="shadow-1 q-mb-md">
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
</template>

<script setup lang="ts">
  import { ICONS } from "@/constants/app/image-icon";
</script>
