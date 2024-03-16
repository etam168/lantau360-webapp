<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ $t(`more.account.title`) }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-card class="text-white bg-primary q-ma-md">
            <q-card-section class="q-ma-none q-pa-none">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle1">Available Credits</q-item-label>
                  <q-item-label caption class="text-white">
                    By this time you spent (15)
                  </q-item-label>
                  <q-item-label class="text-h6 q-pt-sm"> $34.00 </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn dense rounded class="text-primary bg-grey-1 text-caption q-px-md"
                    >Buy Credits</q-btn
                  >
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>

          <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

          <q-separator size="2px" color="primary" />

          <q-tab-panels v-model="tab">
            <q-tab-panel
              v-for="(tabItem, index) in tabItems"
              :key="index"
              :name="tabItem.name"
              class="q-pa-none"
            >
              <q-list>
                <q-item v-for="(subItem, subIndex) in tabItem.subItems" :key="subIndex">
                  <q-item-section>
                    <q-item-label>{{ subItem.name }}</q-item-label>
                    <q-item-label caption>{{ subItem.label }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-negative"> {{ subItem.price }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  // .ts files

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const { t } = useI18n({ useScope: "global" });
  const tab = ref("recentTransactions");
  const setTab = (val: string) => (tab.value = val);

  const tabItems = ref([
    {
      name: "recentTransactions",
      label: t("more.account.recentTransactions"),
      subItems: [
        { name: "Buy/Sell", label: "13 Feb - 11:29Am", price: "- $10.00" },
        { name: "Lost/Found", label: "10 Jan - 10:30Am", price: "- $05.00" }
      ]
    },
    {
      name: "history",
      label: t("more.account.history"),
      subItems: [
        // Add sub-items for "history" here if needed
      ]
    }
  ]);
</script>
