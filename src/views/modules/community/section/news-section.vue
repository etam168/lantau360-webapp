<template>
  <div class="column q-gutter-y-md">
    <news-card
      :class="classMenuItem"
      v-for="item in data"
      :key="item.communityNewsId"
      :data="item"
      @on-click="onItemClick"
    />
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType, computed } from "vue";
  import { useRouter } from "vue-router";

  // 3rd Party
  import { useQuasar } from "quasar";

  //Custom Components
  import NewsCard from "./components/news-card.vue";

  defineProps({
    data: {
      type: Object as PropType<any[]>,
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
      name: "community-list",
      query: { directoryId: value.communityDirectoryId }
    });
  };
</script>
