<template>
  <q-list>
    <div class="row">
      <div class="col-4 q-pa-lg" v-for="directory in data" :key="directory.directoryId">
        <div @click="onItemClick(directory)">
          <div class="text-center">
            <q-avatar>
              <q-img :src="directory?.meta['file-path']" />
            </q-avatar>
          </div>
          <div class="text-h6 text-center q-ma-sm">
            {{ directory.directoryName }}
          </div>
        </div>
      </div>
    </div>
  </q-list>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { useRouter } from "vue-router";

  defineProps({
    data: {
      type: Object as PropType<Directory[]>,
      required: true
    }
  });

  const router = useRouter();

  const onItemClick = (value: any) => {
    router.push({
      name: "site-list",
      query: { directoryId: value.directoryId }
    });
  };
</script>
