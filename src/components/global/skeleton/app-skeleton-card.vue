<template>
  <div class="col-md-3 col-sm-4 col-6">
    <q-card class="my-card">
      <q-responsive :ratio="11 / 8">
        <q-skeleton height="170px" square animation="fade" />
      </q-responsive>

      <div class="row items-center q-pa-md">
        <q-skeleton type="text" width="40%" />
      </div>

      <div class="q-pa-sm"><q-skeleton type="QBtn" bordered width="100%" /></div>
    </q-card>
  </div>
</template>
