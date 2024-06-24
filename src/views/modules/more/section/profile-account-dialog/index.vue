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
        <q-page style="min-height: calc(100vh - 66px)">
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
                <div v-if="tabItem.subItems.length > 0">
                  <q-item
                    v-for="(subItem, subIndex) in tabItem.subItems"
                    :key="subIndex"
                    class="shadow-1 q-pa-md q-mb-md"
                    clickable
                    @click="handleItemClick(subItem)"
                  >
                    <q-item-section>
                      <q-item-label>{{ subItem.title }}</q-item-label>

                      <q-item-label v-if="subItem.directoryName !== null" caption>{{
                        subItem.directoryName + "   -  " + dateFormatter(subItem.createdAt)
                      }}</q-item-label>

                      <q-item-label v-else caption>
                        {{ dateFormatter(subItem.createdAt) }}</q-item-label
                      >
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label :class="subItem.transactionType === 2 ? 'text-red' : ''">
                        {{
                          subItem.transactionType === 2 ? "-" + subItem.points : subItem.points
                        }}</q-item-label
                      >
                      <q-item-label class="text-red" v-if="subItem.isPostExpired == true">{{
                        $t("more.profileSetting.expired")
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div
                  v-else
                  class="row justify-center items-center text-h6 text-weight-regular q-mt-md text-grey-6 text-weight-bold"
                  style="min-height: calc(100vh - 268px)"
                >
                  {{ $t("more.account.noRecord") }}
                </div>
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
  import { useMoreInput } from "../../use-more-input";
  import { PropType } from "vue";

  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const { userStore } = useMoreInput();
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
      component: defineAsyncComponent(
        () => import("./top-up-points/purchase-options-dialog/index.vue")
      )
    });
  };

  function handleItemClick(item: any) {
    if (item.postingId) {
      $q.dialog({
        component: defineAsyncComponent(() => import("./transaction-detail/index.vue")),
        componentProps: {
          item: item
        }
      });
    } else {
      $q.notify({
        message: t("more.message.notPosting"),
        icon: "report_problem",
        color: "yellow-9"
      });
    }
  }

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
