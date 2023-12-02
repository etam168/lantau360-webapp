<template>
  <div class="q-pa-md">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>{{ noticeTime(data?.date) }}</q-item-label>
          <q-item-label
            ><q-badge color="primary" class="text-white"> {{ data?.title }} </q-badge></q-item-label
          >
          <q-item-label caption lines="2">{{ data?.description }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />
    </q-list>
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";
  import { date } from "quasar";

  defineProps({
    data: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const noticeTime = (row: any) => {
    // Check if modifiedAt is undefined or null, provide a default value
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DD");

    return modifiedAt;
  };
</script>
