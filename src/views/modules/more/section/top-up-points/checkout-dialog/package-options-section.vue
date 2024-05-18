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
    <div class="row items-center q-mt-md justify-between q-gutter-y-md q-ml-md">
      <div
        v-for="pPackage in purchasePackages"
        :key="pPackage.amount"
        class="col-6 col-sm-3 row items-center justify-center"
      >
        <q-btn
          :class="{
            'bg-green-8 text-white text-weight-bold': pPackage.amount === selectedPackage.amount
          }"
          class="q-mr-sm"
          style="border-radius: 20px; width: 90%"
          @click="onPackageChange(pPackage)"
          >{{ "$ " + pPackage.amount
          }}<q-badge floating class="bg-amber text-white">{{ pPackage.points }}</q-badge>
        </q-btn>
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
