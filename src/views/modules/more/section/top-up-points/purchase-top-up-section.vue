<template>
  <q-card class="bg-grey-1" style="border: 1px solid #9e9e9e">
    <q-card-section class="text-center">
      <div class="text-h6">{{ $t("more.topUpSection.option2") }}</div>
      <div class="text-subtitle1">{{ $t("more.topUpSection.purchaseTopUpPoints") }}</div>

      <div class="text-body2 q-mt-md text-justify">
        {{ $t("more.topUpSection.purchasePointsDescription") }}
      </div>
    </q-card-section>

    <q-card-actions class="row justify-center">
      <app-button
        class="q-mb-md"
        style="width: 200px"
        :label="$t('more.topUpSection.purchase')"
        color="primary"
        @click="onBtnPurchase"
      />
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
