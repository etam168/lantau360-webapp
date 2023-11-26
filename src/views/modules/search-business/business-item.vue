<template>
  <q-item clickable @click="handleDetail">
    <q-img width="80px" height="80px" :src="computePath(row.iconPath)" />

    <q-item-section class="q-ml-lg">
      <q-item-label>{{ row.title }}</q-item-label>
      <q-item-label>{{ row.subtitle1 }}</q-item-label>
    </q-item-section>

    <q-item-section>
      <q-icon name="favorite" size="2em" color="red" />
      <q-item-label>distance in km</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { BLOB_URL } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { PropType } from "vue";

  const emits = defineEmits(["on-detail"]);

  const computePath = (path: string) => {
    return `${BLOB_URL}/${path}`;
  };

  defineProps({
    row: {
      type: Object as PropType<Business>,
      required: true
    }
  });

  function handleDetail() {
    emits("on-detail");
  }
</script>
