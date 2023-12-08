<template>
  <div class="row q-gutter-y-md">
    <directory-item
      v-for="item in data"
      :key="item.directoryId"
      :data="item"
      :class="classMenuItem"
      @on-dialog="handleDialog"
    />
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, computed, defineAsyncComponent } from "vue";
  import { useQuasar } from "quasar";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { DIRECTORY_BUSINESS_URL } from "@/constants";
  import axios from "axios";

  //Custom Components
  import DirectoryItem from "@/components/custom/directory-item-business.vue";

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

  async function handleDialog(item: any) {
    try {
      const response = await axios.get(`${DIRECTORY_BUSINESS_URL}/${item?.directoryId}`); // Make API call using Axios
      // Assuming a successful response
      if (response.status === 200) {
        $q.dialog({
          component: defineAsyncComponent(() => import("./dialog/business-list-dialog.vue")),
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
  }
  //emits("on-dialog", { directoryId: item.directoryId });
</script>
