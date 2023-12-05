<template>
  <div class="row q-gutter-y-md">
    <directory-item
      v-for="item in data"
      :key="item.directoryId"
      :data="item"
      :class="classMenuItem"
      @on-click="onItemClick"
    />
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, computed, defineAsyncComponent } from "vue";

  import { useQuasar } from "quasar";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { DIRECTORY_SITES_URL } from "@/constants";
  import axios from "axios";

  //Custom Components
  import DirectoryItem from "@/components/custom/directory-item.vue";

  defineProps({
    data: {
      type: Object as PropType<Directory[]>,
      required: true
    }
  });

  const $q = useQuasar();

  const classMenuItem = computed((): string => {
    return $q.screen.gt.xs ? "col-3" : "col-3";
  });

  async function onItemClick(item: any) {
    try {
      const response = await axios.get(`${DIRECTORY_SITES_URL}/${item?.directoryId}`); // Make API call using Axios
      // Assuming a successful response
      if (response.status === 200) {
        $q.dialog({
          component: defineAsyncComponent(() => import("./site-list-dialog.vue")),
          componentProps: {
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
