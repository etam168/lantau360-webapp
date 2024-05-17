<template>
  <q-card
    class="row justify-center items-center q-mb-lg"
    :class="{ 'q-mx-lg q-mt-md': $q.screen.gt.xs }"
    bordered
    :style="{
      width: $q.screen.gt.xs ? '480px' : '100%',
      'border-radius': '15px',
      height: '100px',
      'border-color': 'primary'
    }"
  >
    <div style="display: flex; flex-direction: column">
      <div style="letter-spacing: 2px; font-size: 17px">
        {{ $t("more.account.availablePointBalance") }}
      </div>
      <div style="text-align: center">
        <span style="font-size: 28px; font-weight: 500; letter-spacing: 2px">{{
          availabelPoints
        }}</span>
      </div>
    </div>
  </q-card>

  <div
    :class="{ 'q-ml-lg': $q.screen.gt.xs }"
    :style="{
      width: $q.screen.gt.xs ? '480px' : '100%'
    }"
  >
    <q-item-label
      class="q-ml-sm q-mb-sm"
      style="letter-spacing: 2px; font-size: 20px; font-weight: bold"
      >{{ $t("more.account.topUpYourAccount") }}</q-item-label
    >
    <q-item-label
      class="q-mx-sm q-my-md"
      style="letter-spacing: 1px; font-size: 16px; color: #888"
      >{{ $t("more.account.essentialInformation") }}</q-item-label
    >

    <q-item-label
      class="q-mx-sm q-mt-lg"
      style="letter-spacing: 1px; font-size: 16px; font-weight: bold"
      >{{ $t("more.account.topUpAmount") }}</q-item-label
    >
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/stores/user";

  const { availabelPoints } = useUserStore();
</script>
