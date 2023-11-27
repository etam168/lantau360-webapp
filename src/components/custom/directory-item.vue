<template>
  <div class="text-center">
    <q-avatar v-if="data && data.meta && data.meta['file-path']">
      <q-img :src="data.meta['file-path']" />
    </q-avatar>
    <q-avatar v-else>
      <q-img :src="PLACEHOLDER_THUMBNAIL" />
    </q-avatar>
  </div>
  <div class="text-h6 text-center q-ma-sm">
    {{ data.directoryName }}
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  defineProps({
    data: {
      type: Object as PropType<Directory>,
      required: true
    }
  });
</script>
