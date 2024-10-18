<template>
  <q-card flat style="min-height: 280px">
    <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

    <q-separator spaced />

    <q-tab-panels v-model="tab" animated transition-next="scale" transition-prev="scale">
      <q-tab-panel v-for="(tabItem, index) in tabItems" :key="index" :name="tabItem.name">
        <q-list>
          {{ tabItem.subItems }}
          <!-- <div
            v-else
            class="row justify-center items-center text-h6 text-weight-regular q-mt-md text-grey-6 text-weight-bold text-center"
            style="min-height: calc(100vh - 268px)"
          >
            {{ $t("more.account.noRecord") }}
          </div> -->
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
  import { DirectoryTypes } from "@/interfaces/types/directory-types";

  const { community } = defineProps<{
    community: DirectoryTypes;
  }>();

  const { t } = useI18n({ useScope: "global" });

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("recentTransactions");
  const tabItems = ref([
    {
      name: "allPropertyRent",
      label: "All Property Rent",
      subItems: community || []
    },
    { name: "myPropertyRent", label: "My Property Rent", subItems: community || [] }
  ]);

  function handleItemClick(item: any) {}
</script>
