<template>
  <q-card flat class="location-card">
    <q-card-section class="location-card-section">
      <div class="warning-content">
        <q-icon name="warning" class="warning-icon" color="negative" />
        <div class="warning-message">{{ errorMessage }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
  import GeoLocationError from "@/interfaces/geo-location-error";
  import i18n from "@/plugins/i18n/i18n";

  const props = defineProps({
    error: {
      type: Object as PropType<GeoLocationError>
    }
  });
  const { t } = i18n.global;
  const { error } = props;

  const errorCodes = {
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
    DEVICE_SUPPORT_ERROR: 4,
    ADDRESS_ERROR: 5
  };

  const errorMessageList = computed(() => [
    { code: errorCodes.PERMISSION_DENIED, message: t("home.locationPermissionDenied") },
    {
      code: errorCodes.POSITION_UNAVAILABLE,
      message:
        "Location un-available, please check the locaton service settings and internet connection. "
    },
    {
      code: errorCodes.TIMEOUT,
      message: "Timeout to pick the location, please check your internet connection"
    },
    {
      code: errorCodes.DEVICE_SUPPORT_ERROR,
      message: "Sorry, your doesn't support location services"
    },
    { code: errorCodes.ADDRESS_ERROR, message: "Sorry, unable to pick the address" }
  ]);

  const errorMessage = computed(() => {
    const errorObject = errorMessageList.value.find(er => er.code == error?.code);
    return errorObject
      ? errorObject.message
      : "Something wen't wrong to pick current location, please try again";
  });
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
