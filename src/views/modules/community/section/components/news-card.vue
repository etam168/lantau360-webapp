<template>
  <div class="q-pa-md">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>{{ newsTime(data) }}</q-item-label>
          <q-item-label>{{ data?.communityNewsName }}</q-item-label>
          <q-item-label caption lines="2"> <div v-html="data.description"></div></q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />
    </q-list>
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  // import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { CommunityNews } from "@/interfaces/models/entities/communityNews";
  import { date } from "quasar";
  import { PropType } from "vue";

  defineProps({
    data: {
      type: Object as PropType<CommunityNews>,
      required: true
    }
  });

  const newsTime = (row: CommunityNews) => {
    // Check if modifiedAt is undefined or null, provide a default value
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DDT09:00");

    return modifiedAt;
  };
</script>
