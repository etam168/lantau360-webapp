<template>
  <q-item>
    <q-item-section avatar>
      <q-avatar>
        <q-img
          :placeholder-src="PLACEHOLDER_AVATAR"
          :src="imagePath == null ? PLACEHOLDER_AVATAR : imagePath"
        />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ alias || "N/A" }}</q-item-label>
      <q-item-label>{{ meta?.i18n?.hk?.alias || "N/A" }}</q-item-label>
      <q-item-label caption class="text-bold text-warning">
        {{ licenseNo }}
        <!-- <span class="text-bold text-orange">{{ licenseNo }}</span> -->
      </q-item-label>
    </q-item-section>

    <q-item-section top side class="text-dark">
      <q-item-label>
        <!-- Add the phone icon here -->
        <q-icon name="fas fa-phone" class="q-mr-sm text-primary" />
        {{ phone || "N/A" }}
      </q-item-label>
      <q-item-label>
        <!-- Add the WhatsApp icon here -->
        <q-icon name="fab fa-whatsapp" class="q-mr-sm text-primary" />
        {{ whatsapp || "N/A" }}
      </q-item-label>
      <q-item-label>
        <!-- Add the email icon here -->
        <q-icon name="fas fa-envelope" class="q-mr-sm text-primary" />
        {{ email || "N/A" }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-separator inset spaced="4px" />
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";

  // .ts files
  import { PLACEHOLDER_AVATAR } from "@/constants";

  defineProps({
    alias: {
      type: String
    },
    imagePath: {
      type: String,
      required: false,
      default: PLACEHOLDER_AVATAR
    },
    licenseNo: {
      type: String
    },
    phone: {
      type: String
    },
    whatsapp: {
      type: String
    },
    email: {
      type: String
    },
    meta: {
      type: Object as PropType<Record<string, any> | null>,
      required: false
    }
  });
</script>
