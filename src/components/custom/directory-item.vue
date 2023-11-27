<template>
  <div class="text-center">
    <q-avatar>
      <q-img :src="data?.meta['file-path']" />
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

  defineProps({
    data: {
      type: Object as PropType<Directory>,
      required: true
    }
  });
</script>
