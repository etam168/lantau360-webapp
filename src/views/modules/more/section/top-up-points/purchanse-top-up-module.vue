<template>
  <q-card flat style="border: 1px solid #9e9e9e">
    <q-card-section class="text-center">
      <div class="text-h6">Option 2</div>
      <div class="text-subtitle1">Purchase top-up points</div>

      <div class="text-body2 q-mt-md">
        Purchase points to gain the ability to publish posts in the community module. By buying
        points, users can actively participate and share their thoughts, ideas, and content with the
        community.
      </div>
    </q-card-section>

    <q-card-actions class="q-pa-md no-wrap">
      <app-button class="full-width" label="Purchase" color="primary" @click="onBtnPurchase" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  const $q = useQuasar();

  const emits = defineEmits(["close-dialog"]);

  function onBtnPurchase() {
    $q.dialog({
      component: defineAsyncComponent(() => import("./purchase-dialog.vue"))
    });
    emits("close-dialog", false);
  }
</script>
