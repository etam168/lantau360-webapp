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
  import { DIRECTORY_GROUPS } from "@/constants";
  import { DIRECTORY_SITES_URL, DIRECTORY_BUSINESS_URL } from "@/constants";

  defineProps({
    data: {
      type: Object as PropType<Directory[]>,
      required: true
    }
  });

  const $q = useQuasar();

  const handleDialog = async (item: Directory) => {
    try {
      let directoryBaseUrl = null;
      if (item.groupId == DIRECTORY_GROUPS.HOME) {
        directoryBaseUrl = DIRECTORY_SITES_URL;
      } else if (item.groupId == DIRECTORY_GROUPS.BUSINESS) {
        directoryBaseUrl = DIRECTORY_BUSINESS_URL;
      }
      const response = await axios.get(`${directoryBaseUrl}/${item.directoryId}`);
      if (response.status === 200) {
        const groupByKey = item.meta?.groupByKey ?? null; // Default to null or undefined if not set

        $q.dialog({
          component: defineAsyncComponent(
            () => import("@/components/dialog/category-item-list-dialog.vue")
          ),
          componentProps: {
            directory: item,
            directoryItemsList: response.data,
            groupBykey: groupByKey // This will be null if not set by the conditions above
          }
        });
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Throttle the handleDialog function
  // Here we're specifying a 500ms throttle period. Adjust as needed.
  const throttledHandleDialog = throttle(handleDialog, 1000);
</script>
