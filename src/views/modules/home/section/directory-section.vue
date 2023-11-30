<template>
  <div class="row q-gutter-y-md">
    <directory-item
      v-for="item in data"
      :key="item.directoryId"
      :data="item"
      :class="classMenuItem"
      @on-click="onItemClick"
    />
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, computed } from "vue";

  import { useQuasar } from "quasar";

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
  const $q = useQuasar();

  const classMenuItem = computed((): string => {
    return $q.screen.gt.xs ? "col-3" : "col-3";
  });

  const onItemClick = (value: any) => {
    router.push({
      name: "site-list",
      query: { directoryId: value.directoryId }
    });
  };
</script>
