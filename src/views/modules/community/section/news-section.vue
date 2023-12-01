<template>
  <div class="column q-gutter-y-md">
    <news-card
      :class="classMenuItem"
      v-for="item in data.slice(0, 8)"
      :key="item.directoryId"
      :data="item"
      @on-click="onItemClick"
    />
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  // import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { PropType, computed } from "vue";
  import { useQuasar } from "quasar";

  //Custom Components
  import NewsCard from "./cards/news-card.vue";

  // .ts file
  import { useRouter } from "vue-router";
  defineProps({
    data: {
      type: Object as PropType<any[]>,
      required: true
    }
  });

  const router = useRouter();
  const $q = useQuasar();
  // function computeImagePath(imagePath: any) {
  //   return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  // }

  const classMenuItem = computed((): string => {
    return $q.screen.gt.xs ? "col-3" : "col-3";
  });

  const onItemClick = (value: any) => {
    router.push({
      name: "community-list",
      query: { directoryId: value.communityDirectoryId }
    });
  };
</script>
