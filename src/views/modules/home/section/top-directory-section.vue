<template>
  <div class="row no-wrap">
    <div class="col-4 q-px-lg q-py-sm" v-for="directory in data" :key="directory.directoryId">
      <div @click="onItemClick(directory)">
        <directory-item :data="directory" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  // .ts file
  import { useRouter } from "vue-router";

  //Custom Components
  import DirectoryItem from "@/components/custom/directory-item.vue";
  // Json
  import directorData from "./data/data.json";
  import { ref } from "vue";

  const router = useRouter();
  const data = ref<any>(directorData || []);

  const onItemClick = (value: any) => {
    router.push({
      name: "site-list",
      query: { directoryId: value.directoryId }
    });
  };
</script>
