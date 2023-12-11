<template>
  <div class="row q-gutter-y-md">
    <app-directory-item
      v-for="item in data"
      :key="item.communityDirectoryId"
      :item="item"
      class="col-3"
      @on-click="throttledHandleDialog"
    />
  </div>
</template>

<script setup lang="ts">
  // Quasar Import
  import { throttle, useQuasar } from "quasar";

  // .ts file
  import { DIRECTORY_POST_URL } from "@/constants";
  import { CommunityDirectory } from "@/interfaces/models/entities/communityDirectory";

  defineProps({
    data: {
      type: Object as PropType<CommunityDirectory[]>,
      required: true
    }
  });

  const $q = useQuasar();
  const handleDialog = async (item: CommunityDirectory) => {
    try {
      const response = await axios.get(`${DIRECTORY_POST_URL}/${item?.communityDirectoryId}`); // Make API call using Axios
      // Assuming a successful response
      if (response.status === 200) {
        $q.dialog({
          component: defineAsyncComponent(() => import("./dialog/community-list-dialog.vue")),
          componentProps: {
            directory: item,
            directoryItemsList: response.data
          }
        });
      }
    } catch (error) {
      // Handle error if the API call fails
      console.error("Error fetching data: ", error);
    }
  };

  // Throttle the handleDialog function
  const throttledHandleDialog = throttle(handleDialog, 500);
</script>
