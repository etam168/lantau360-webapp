<template>
  <div class="row q-gutter-y-md">
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
  import { useQuasar } from "quasar";

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
  const $q = useQuasar();

  const classMenuItem = computed((): string => {
    return $q.screen.gt.xs ? "col-3" : "col-3";
  });

  const onItemClick = (value: any) => {
    router.push({
      name: "business-list",
      query: { directoryId: value.directoryId }
    });
  };
</script>
