<template>
  <q-item>
    <q-img height="400px" :src="computePath(directoryItem.imagePath)" />
  </q-item>

  <q-item>
    <q-icon name="location_on" size="2em" color="blue" />
    <q-item-label class="q-mt-sm">{{ directoryItem.subtitle1 }}</q-item-label>
  </q-item>

  <q-item>
    <q-btn color="primary" text-color="white" icon="location_on" round />
    <q-space />
    <q-btn color="primary" text-color="white" icon="photo_library" round />
    <q-space />
    <q-btn color="primary" text-color="white" icon="phone" round />
    <q-space />
    <q-btn color="primary" text-color="white" icon="favorite" round />
  </q-item>
  <q-separator class="q-mt-sm" />

  <q-item>
    <div v-html="directoryItem.description"></div>
  </q-item>
  <q-separator class="q-mt-sm" />
</template>

<script setup lang="ts">
  import { BLOB_URL, SITE_URL } from "@/constants";
  import { Site } from "@/interfaces/site";
  import axios, { AxiosError } from "axios";
  import { onMounted } from "vue";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const directoryItem = ref<Site>({} as Site);
  const error = ref<string | null>(null);
  const { query } = router.currentRoute.value;

  onMounted(() => {
    loadData();
  });

  const computePath = (path: string) => {
    return `${BLOB_URL}/${path}`;
  };

  const loadData = async () => {
    if (query?.directoryItemId !== undefined) {
      try {
        const [response] = await Promise.all([
          axios.get<Site>(`${SITE_URL}/${query?.directoryItemId}`)
        ]);
        directoryItem.value = response.data;
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
