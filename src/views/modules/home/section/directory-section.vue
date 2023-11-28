<template>
  <q-list>
    <div class="row">
      <div class="col-3 q-pa-lg" v-for="directory in data" :key="directory.directoryId">
        <div @click="onItemClick(directory)">
          <directory-item :data="directory" />
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

  //Custom Components
  import DirectoryItem from "@/components/custom/directory-item.vue";

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
