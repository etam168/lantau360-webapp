<template>
  <q-card flat class="location-card">
    <q-card-section class="location-card-section">
      <q-item>
        <q-spinner-rings color="primary" size="5em" />
        <div class="loading-message">{{ $t("home.loadingRefreshLocation") }}</div>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<style scoped>
  .location-card {
    display: flex;
    justify-content: center;
    height: 400px;
  }

  .location-card-section {
    padding: 8px;
    width: 100%;
    max-width: 400px;
  }

  .location-content {
    text-align: center;
  }

  .loading-message {
    margin-top: 25px;
    font-size: 15px;
    color: #333;
  }
</style>
