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
  // import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { PropType } from "vue";

  //Custom Components
  import DirectoryItem from "@/components/custom/directory-item.vue";

  // .ts file
  import { useRouter } from "vue-router";
  defineProps({
    data: {
      type: Object as PropType<any[]>,
      required: true
    }
  });

  const router = useRouter();

  // function computeImagePath(imagePath: any) {
  //   return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  // }
  const onItemClick = (value: any) => {
    router.push({
      name: "community-list",
      query: { directoryId: value.communityDirectoryId }
    });
  };
</script>
