<template>
  <div class="row q-gutter-y-md">
    <app-directory-item
      v-for="(item, index) in data"
      :key="index"
      :item="item"
      :class="{ 'col-4': $q.screen.lt.sm, 'col-3': !$q.screen.lt.sm }"
      @on-click="throttledHandleDialog"
    />
  </div>
</template>

<script setup lang="ts">
  // Quasar Import
  import { throttle, useQuasar } from "quasar";

  // interface files
  import { DirectoryTypes } from "@/interfaces/types/directory-types";

  // .ts file
  import { DIRECTORY_GROUPS, URL } from "@/constants";

  defineProps({
    data: {
      type: Object as PropType<DirectoryTypes[]>,
      required: true
    }
  });

  const $q = useQuasar();

  const handleDialog = async (item: DirectoryTypes) => {
    try {
      const directoryListUrl = (() => {
        switch (true) {
          case "communityDirectoryId" in item:
            return `${URL.DIRECTORY_LIST.POSTING}/${item.communityDirectoryId}`;
          case "groupId" in item && DIRECTORY_GROUPS.HOME.includes(item.groupId):
            return `${URL.DIRECTORY_LIST.SITE}/${item.directoryId}`;
          case "groupId" in item && DIRECTORY_GROUPS.BUSINESS.includes(item.groupId):
            return `${URL.DIRECTORY_LIST.BUSINESS}/${item.directoryId}`;
          default:
            throw new Error("Unknown directory type");
        }
      })();

      const response = await axios.get(directoryListUrl);
      if (response.status === 200) {
        $q.dialog({
          component: defineAsyncComponent(
            () => import("@/components/dialog/category-item-list-dialog.vue")
          ),
          componentProps: {
            directoryItemsList: response.data,
            directory: item
            // groupBykey: groupBy
          }
        });
      } else {
        // console.error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      // console.error("Error fetching data: ", error);
    }
  };

  // Throttle the handleDialog function
  const throttledHandleDialog = throttle(handleDialog, 2000);
</script>
