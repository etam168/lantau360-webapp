<template>
  <q-card flat class="row justify-center">
    <q-card-section
      class="q-ma-none q-pa-xs"
      :style="$q.screen.gt.xs ? 'width: 400px' : 'width : 100%'"
    >
      <div>
        {{ $t("home.loadingRefreshLocation") }}
      </div>
    </q-card-section>
  </q-card>
</template>
