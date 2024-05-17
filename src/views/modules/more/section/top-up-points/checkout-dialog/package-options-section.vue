<template>
  <div>
    <q-card
      flat
      bordered
      :style="{
        'margin-left': '8px',
        'margin-right': $q.screen.gt.xs ? '33px' : '8px',
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
      :style="{ 'margin-left': $q.screen.gt.xs ? '20px' : '8px' }"
    >
      <div v-for="pPackage in purchasePackages" :key="pPackage.amount">
        <q-btn
          :class="{
            'bg-green-8 text-white text-weight-bold': pPackage.amount === selectedPackage.amount
          }"
          :style="{ width: '70px', 'margin-right': '8px', 'border-radius': '20px' }"
          @click="onPackageChange(pPackage)"
          >{{ pPackage.amount }}</q-btn
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const purchasePackages = [
    { amount: 5, points: 50 },
    { amount: 10, points: 100 },
    { amount: 20, points: 250 },
    { amount: 30, points: 400 }
  ];
  const selectedPackage = inject("selectedPackage") as Ref<any>;
  onBeforeMount(() => {
    selectedPackage.value = purchasePackages[0];
  });
  function onPackageChange(value: any) {
    selectedPackage.value = value;
  }
</script>
