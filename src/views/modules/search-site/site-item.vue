<template>
  <q-item clickable @click="handleDetail">
    <q-img width="80px" height="80px" :src="computePath(row.iconPath)" />

    <q-item-section class="q-ml-lg">
      <q-item-label>{{ row.title }}</q-item-label>
      <q-item-label>{{ row.subtitle1 }}</q-item-label>
    </q-item-section>

    <q-item-section>
      <q-icon name="favorite" size="2em" color="red" />
      <q-item-label>distance in km</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { BLOB_URL } from "@/constants";
  import { Site } from "@/interfaces/site";
  import { PropType } from "vue";

  const emits = defineEmits(["on-detail"]);

  const computePath = (path: string) => {
    return `${BLOB_URL}/${path}`;
  };

  defineProps({
    row: {
      type: Object as PropType<Site>,
      required: true
    }
  });

  function handleDetail() {
    emits("on-detail");
  }

  // const loadData = async () => {
  //   if (query?.directoryId !== undefined) {
  //     try {
  //       const [response, respDirectory] = await Promise.all([
  //         axios.get(`${DIRECTORY_SITES_URL}/${query?.directoryId}`),
  //         axios.get(`${DIRECTORY_URL}/${query?.directoryId}`)
  //       ]);
  //       directoryItems.value = response.data;
  //       directory.value = respDirectory.data;
  //     } catch (err) {
  //       if (err instanceof AxiosError) {
  //         if (err.response && err.response.status === 404) {
  //           error.value = "Not found";
  //         } else {
  //           error.value = "An error occurred";
  //         }
  //       } else {
  //         error.value = "An unexpected error occurred";
  //       }
  //     }
  //   }
  // };
</script>
