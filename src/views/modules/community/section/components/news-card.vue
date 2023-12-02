<template>
  <div class="q-pa-md">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>{{ data?.date }}</q-item-label>
          <q-item-label>{{ data?.title }}</q-item-label>
          <q-item-label caption lines="2">{{ data.description }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />
    </q-list>
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  // import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { PropType } from "vue";

  defineProps({
    data: {
      type: Object as PropType<any[]>,
      required: true
    }
  });
</script>
