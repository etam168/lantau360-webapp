<template>
  <q-dialog
    ref="dialogRef"
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
          <q-card class="text-white bg-primary q-ma-md q-py-md">
            <q-card-section class="q-ma-none q-pa-none">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-subtitle1"
                    >{{
                      $t("more.profileSetting.availablePoints", {
                        availablePoints: userStore.availabelPoints
                      })
                    }}
                  </q-item-label>
                  <q-item-label caption class="text-white">
                    {{
                      $t("more.profileSetting.bythisTimeText", {
                        spentPoints: userStore.spendPoints
                      })
                    }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    dense
                    rounded
                    @click="onBtnBuyPoints"
                    class="text-primary bg-grey-1 text-caption q-px-md"
                    >{{ $t("more.profileSetting.buyPoints") }}</q-btn
                  >
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>

          <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

          <q-separator size="2px" color="primary" />
          <q-tab-panels v-model="tab">
            <q-tab-panel v-for="(tabItem, index) in tabItems" :key="index" :name="tabItem.name">
              <q-list>
                <q-item
                  v-for="(subItem, subIndex) in tabItem.subItems"
                  :key="subIndex"
                  class="shadow-1 q-pa-md q-mb-md"
                >
                  <q-item-section>
                    <q-item-label>{{ subItem.title }}</q-item-label>

                    <q-item-label v-if="subItem.directoryName !== null" caption>{{
                      subItem.directoryName + "   -  " + dateFormatter(subItem.createdAt)
                    }}</q-item-label>

                    <q-item-label v-else caption>{{
                      dateFormatter(subItem.createdAt)
                    }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label
                      :style="{ color: subItem.transactionType === 2 ? 'red' : 'black' }"
                    >
                      {{ subItem.points }}</q-item-label
                    >
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
  import { TransactionView } from "@/interfaces/models/views/trasaction-view";
  import { useMoreInput } from "../use-more-input";
  import { PropType } from "vue";

  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const { claimFreePoints, userStore } = useMoreInput();
  const { dateFormatter } = useUtilities();

  const props = defineProps({
    trHistory: {
      type: Array as PropType<TransactionView[]>
    },
    trRecent: {
      type: Array as PropType<TransactionView[]>
    }
  });

  const tab = ref("recentTransactions");
  const setTab = (val: string) => (tab.value = val);

  const onBtnBuyPoints = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("../purchase-confirmation-dialog.vue")),
      componentProps: {
        callback: claimFreePoints
      }
    });
  };

  const tabItems = ref([
    {
      name: "recentTransactions",
      label: t("more.account.recentTransactions"),
      subItems: props.trRecent || []
    },
    {
      name: "history",
      label: t("more.account.history"),
      subItems: props.trHistory || []
    }
  ]);
</script>
