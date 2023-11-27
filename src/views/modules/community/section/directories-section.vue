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
