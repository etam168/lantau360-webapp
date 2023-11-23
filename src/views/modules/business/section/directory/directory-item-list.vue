<template>
  <q-item clickable v-for="item in directoryItems" :key="item.siteId" @click="onItemClick(item)">
    <q-img width="80px" height="80px" :src="computePath(item.iconPath)" />

    <q-item-section class="q-ml-lg">
      <q-item-label>{{ item.title }}</q-item-label>
      <q-item-label>{{ item.subtitle1 }}</q-item-label>
    </q-item-section>

    <q-item-section>
      <q-icon name="favorite" size="2em" color="red" />
      <q-item-label>distance in km</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { BLOB_URL, DIRECTORY_BUSINESS_URL } from "@/constants";
  import axios, { AxiosError } from "axios";
  import { onMounted } from "vue";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const directoryItems = ref();
  const error = ref<string | null>(null);
  const { query } = router.currentRoute.value;

  onMounted(() => {
    loadData();
  });

  const onItemClick = (value: any) => {
    router.push({
      name: "business-directory-item-detail",
      query: { directoryItemId: value.businessId }
    });
  };

  const computePath = (path: string) => {
    return `${BLOB_URL}/${path}`;
  };

  const loadData = async () => {
    if (query?.directoryId !== undefined) {
      try {
        const [response] = await Promise.all([
          axios.get(`${DIRECTORY_BUSINESS_URL}/${query?.directoryId}`)
        ]);
        directoryItems.value = response.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response && err.response.status === 404) {
            error.value = "Not found";
          } else {
            error.value = "An error occurred";
          }
        } else {
          error.value = "An unexpected error occurred";
        }
      }
    }
  };
</script>
