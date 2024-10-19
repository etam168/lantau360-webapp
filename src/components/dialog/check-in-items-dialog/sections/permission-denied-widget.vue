<template>
  <q-card flat class="location-card">
    <q-card-section class="location-card-section">
      <div class="warning-content">
        <q-icon :name="fasTriangleExclamation" class="warning-icon" color="negative" />
        <div class="warning-message">{{ $t("errors.locationPermissionDenied") }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { fasTriangleExclamation } from "@quasar/extras/fontawesome-v6";
</script>

<style scoped>
  .location-card {
    display: flex;
    justify-content: center;
  }

  .location-card-section {
    padding: 8px;
    width: 100%;
    max-width: 400px; /* Limit width to 400px */
  }

  .warning-content {
    text-align: center;
  }

  .warning-icon {
    font-size: 48px;
  }

  .warning-message {
    margin-top: 16px;
    font-weight: 600;
    font-size: 14px;
  }

  .refresh-btn {
    margin-top: 16px;
  }
</style>
