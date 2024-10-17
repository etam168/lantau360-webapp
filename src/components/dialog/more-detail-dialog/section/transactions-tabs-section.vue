<template>
  <pre>{{ moreData }}</pre>
  <!-- <q-card bordered style="min-height: 280px">
    <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

    <q-separator spaced />

    <q-tab-panels v-model="tab" animated transition-next="scale" transition-prev="scale">
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

                <q-item-label v-else caption> {{ dateFormatter(subItem.createdAt) }}</q-item-label>
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
            class="row justify-center items-center text-h6 text-weight-regular q-mt-md text-grey-6 text-weight-bold text-center"
            style="min-height: calc(100vh - 268px)"
          >
            {{ $t("more.account.noRecord") }}
          </div>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-card> -->
</template>

<script setup lang="ts">
  // Props
  const { moreData } = defineProps<{
    moreData: any;
  }>();

  const { t } = useI18n({ useScope: "global" });
  const { dateFormatter } = useUtilities();
  const i18nKey = `more.account`;

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("recentTransactions");
  // const tabItems = ref([
  //   {
  //     name: "recentTransactions",
  //     label: t(`${i18nKey}.recentTransactions`),
  //     subItems: moreData.trRecent || []
  //   },
  //   { name: "history", label: t(`${i18nKey}.history`), subItems: moreData.trHistory || [] }
  // ]);

  function handleItemClick(item: any) {
    // if (item.postingId) {
    //   $q.dialog({
    //     component: defineAsyncComponent(() => import("./transaction-detail/index.vue")),
    //     componentProps: {
    //       item: item
    //     }
    //   });
    // } else {
    //   $q.notify({
    //     message: t("more.message.notPosting"),
    //     icon: "report_problem",
    //     color: "yellow-9"
    //   });
    // }
  }
</script>
