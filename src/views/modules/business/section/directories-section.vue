<template>
  <q-list>
    <div class="row">
      <div class="col-3 q-pa-lg" v-for="directory in data.slice(0, 8)" :key="directory.directoryId">
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

  //Custom Components
  import DirectoryItem from "@/components/custom/directory-item.vue";

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
      name: "business-list",
      query: { directoryId: value.directoryId }
    });
  };
</script>
