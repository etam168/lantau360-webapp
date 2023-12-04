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

  const props = defineProps({
    data: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const noticeTime = (row: any) => {
    debugger;
    console.log(props.data);
    // Check if row is null or undefined
    if (row === null || row === undefined) {
      return ""; // Return an empty string or any default value if row is null or undefined
    }

    // Check if modifiedAt is present in the row object
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DD");

    return modifiedAt;
  };
</script>
