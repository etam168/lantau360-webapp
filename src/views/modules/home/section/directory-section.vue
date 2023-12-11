<template>
  <div class="row q-gutter-y-md">
    <app-directory-item
      v-for="item in data"
      :key="item.directoryId"
      :item="item"
      class="col-3"
      @on-click="throttledHandleDialog"
    />
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, defineAsyncComponent } from "vue";
  import { throttle, useQuasar } from "quasar";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { DIRECTORY_SITES_URL } from "@/constants";

  defineProps({
    data: {
      type: Object as PropType<Directory[]>,
      required: true
    }
  });

  const $q = useQuasar();

  const handleDialog = async (item: Directory) => {
    try {
      const response = await axios.get(`${DIRECTORY_SITES_URL}/${item.directoryId}`); // Make API call using Axios
      // Assuming a successful response
      if (response.status === 200) {
        $q.dialog({
          component: defineAsyncComponent(() => import("./dialog/site-list-dialog.vue")),
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
  // Here we're specifying a 500ms throttle period. Adjust as needed.
  const throttledHandleDialog = throttle(handleDialog, 500);
</script>
