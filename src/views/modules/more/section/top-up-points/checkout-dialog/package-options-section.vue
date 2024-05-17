<template>
  <div>
    <q-card
      flat
      bordered
      :style="{
        'margin-left': '15px',
        'margin-top': '10px',
        'border-radius': '10px',
        'border-color': 'lightgray'
      }"
      class="q-py-sm q-px-md"
      ><span style="font-size: 18px; font-weight: 600">{{ "$ " + selectedPackage.amount }}</span
      ><span class="q-ml-xl">{{ "Points : " + selectedPackage.points }}</span>
    </q-card>
    <div
      class="row items-center q-mt-md"
      :style="{ 'margin-left': $q.screen.gt.xs ? '28px' : '12px' }"
    >
      <div v-for="pPackage in purchasePackages" :key="pPackage.amount">
        <q-btn
          :class="{
            'bg-green-8 text-white text-weight-bold': pPackage.amount === selectedPackage.amount
          }"
          :style="{ width: '70px', 'margin-right': '8px', 'border-radius': '20px' }"
          @click="onPackageChange(pPackage)"
          >{{ "$" + pPackage.amount }}<q-badge align="top">{{}}</q-badge></q-btn
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const purchasePackages = [
    { amount: 10, points: 100, stripePriceId: "price_1PH3WiKoVaDaLA5GhCh3tebl" },
    { amount: 20, points: 200, stripePriceId: "price_1PHNHjKoVaDaLA5G3DL2gjkx" },
    { amount: 25, points: 300, stripePriceId: "price_1PHNITKoVaDaLA5GIgqhjTQT" },
    { amount: 30, points: 400, stripePriceId: "price_1PHNIsKoVaDaLA5GoSiB1pse" }
  ];
  const selectedPackage = inject("selectedPackage") as Ref<any>;
  onBeforeMount(() => {
    selectedPackage.value = purchasePackages[0];
  });
  function onPackageChange(value: any) {
    selectedPackage.value = value;
  }
</script>
