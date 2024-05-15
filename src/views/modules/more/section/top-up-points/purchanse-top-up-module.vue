<template>
  <q-card-section class="text-center">
    <div class="text-h6 q-mb-lg">Purchase top up points</div>

    <div class="text-body2">
      Purchase points to gain the ability to publish posts in the community module. By buying
      points, users can actively participate and share their thoughts, ideas, and content with the
      community.
    </div>
  </q-card-section>

  <q-card-actions class="q-px-none no-wrap">
    <app-button
      class="full-width"
      :label="$t('more.creditCard.claimYourFreePoint')"
      color="primary"
      @click="onBtnPurchase"
    />
  </q-card-actions>
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
