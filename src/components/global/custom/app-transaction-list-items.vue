<template>
  <q-list class="q-ma-md">
    <q-item
      class="shadow-1 q-pa-md q-mb-md"
      clickable
      @click="handleDetail(item)"
      v-for="(item, index) in transactionItem"
      :key="index"
    >
      <q-item-section>
        <q-item-label>{{ item.title }}</q-item-label>

        <q-item-label v-if="item.directoryName !== null" caption>{{
          item.directoryName + "   -  " + dateFormatter(item.createdAt)
        }}</q-item-label>

        <q-item-label v-else caption> {{ dateFormatter(item.createdAt) }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label :class="item.transactionType === 2 ? 'text-red' : ''">
          {{ item.transactionType === 2 ? "-" + item.points : item.points }}</q-item-label
        >
        <q-item-label class="text-red" v-if="item.isPostExpired == true">{{
          $t("more.profileSetting.expired")
        }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files

  // .ts files
  import { EntityURLKey } from "@/constants";
  import { TransactionView } from "@/interfaces/models/views/trasaction-view";
import { CategoryTypes } from "@/interfaces/types/category-types";

  const { getEntityName, dateFormatter } = useUtilities();

  const emits = defineEmits(["on-member-detail"]);

  // Props
  const { memberItems, entityKey } = defineProps<{
    memberItems: CategoryTypes[];
    entityKey: EntityURLKey;
  }>();

  const entityName = getEntityName(entityKey);

  const transactionItem = ref<TransactionView[]>(memberItems as TransactionView[])

  const items = computed(() => {
    switch (entityKey) {
      case "POSTING":
        return ["posting"];
      default:
        return ["N/A"];
    }
  });

  function handleDetail(item: any) {
    // emits("on-member-detail", item);
  }
</script>
