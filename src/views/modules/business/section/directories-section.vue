<template>
  <div class="row">
    <directory-item
      class="col-3 q-pa-lg"
      v-for="item in data.slice(0, 8)"
      :key="item.directoryId"
      :data="item"
      @on-click="onItemClick"
    />
  </div>
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
