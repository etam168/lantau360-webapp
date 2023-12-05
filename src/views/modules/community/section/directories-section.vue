<template>
  <div class="row q-gutter-y-md">
    <directory-item
      :class="classMenuItem"
      v-for="item in data"
      :key="item.communityDirectoryId"
      :data="item"
      @on-click="handleDialog"
    />
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { DIRECTORY_POST_URL } from "@/constants";
  import { PropType, computed, defineAsyncComponent } from "vue";

  import { useQuasar } from "quasar";
  import axios from "axios";

  // .ts file
  // import { CommunityDirectory } from "@/interfaces/models/entities/communityDirectory";

  //Custom Components
  import DirectoryItem from "@/components/custom/directory-item.vue";

  // .ts file
  //import { useRouter } from "vue-router";
  defineProps({
    data: {
      type: Object as PropType<any[]>,
      required: true
    }
  });

  //const router = useRouter();
  const $q = useQuasar();
  // function computeImagePath(imagePath: any) {
  //   return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  // }

  const classMenuItem = computed((): string => {
    return $q.screen.gt.xs ? "col-3" : "col-3";
  });

  // const onItemClick = (value: any) => {
  //   router.push({
  //     name: "community-list",
  //     query: { directoryId: value.communityDirectoryId }
  //   });
  // };

  async function handleDialog(item: any) {
    try {
      const response = await axios.get(`${DIRECTORY_POST_URL}/${item?.communityDirectoryId}`); // Make API call using Axios
      // Assuming a successful response
      if (response.status === 200) {
        $q.dialog({
          component: defineAsyncComponent(() => import("./post-list-dialog.vue")),
          componentProps: {
            directoryName: item.directoryName,
            directoryItemsList: response.data
          }
        });
      }
    } catch (error) {
      // Handle error if the API call fails
      console.error("Error fetching data: ", error);
    }
  }
</script>
