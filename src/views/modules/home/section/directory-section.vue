<template>
  <div class="row">
    <directory-item
      :class="classMenuItem"
      v-for="item in data"
      :key="item.directoryId"
      :data="item"
      @on-click="onItemClick"
    />
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType, computed } from "vue";

  import { Screen } from "quasar";

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

  const classMenuItem = computed((): string => {
    return Screen.gt.xs ? "col-3" : "col-4";
  });

  const onItemClick = (value: any) => {
    router.push({
      name: "site-list",
      query: { directoryId: value.directoryId }
    });
  };
</script>
