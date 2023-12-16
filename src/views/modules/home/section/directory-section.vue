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
  import { DIRECTORY_SITES_URL, DIRECTORY_GROUPS } from "@/constants";

  defineProps({
    data: {
      type: Object as PropType<Directory[]>,
      required: true
    }
  });

  const $q = useQuasar();

  const handleDialog = async (item: Directory) => {
    try {
      const response = await axios.get(`${DIRECTORY_SITES_URL}/${item.directoryId}`);

      if (response.status === 200) {
        let groupByKey = null; // Default to null or undefined if not set

        if (item.directoryId === DIRECTORY_GROUPS.TIMETABLE) {
          groupByKey = "subtitle3";
        } else if (item.directoryId === DIRECTORY_GROUPS.TAXI) {
          groupByKey = "title";
        }

        $q.dialog({
          component: defineAsyncComponent(
            () => import("@/components/dialog/category-item-list-dialog.vue")
          ),
          componentProps: {
            directory: item,
            directoryItemsList: response.data,
            groupByKey // This will be null if not set by the conditions above
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
