<template>
  <hero-section :data="heroData" />
</template>
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { provide, ref } from "vue";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file

  const heroData = ref<any | null>(null);
  const error = ref<string | null>(null);

  //   try {
  //     const [response1, response2, response3, messageLists] = await Promise.all([
  //       axios.get<PropertyListingDatatable[]>(Latest_PROPERTIES_URL),
  //       axios.get<PropertyListingDatatable[]>(HERO_PROPERTIES_URL),
  //       axios.get<PropertyListingDatatable[]>(FEATURED_PROPERTIES_URL),
  //       axios.get<RequestMessage[]>(REQUEST_MESSAGE_URL)
  //     ]);
  //     data.value = response1.data;
  //     heroData.value = response2.data;
  //     featurePropertydata.value = response3.data;
  //     messageList.value = messageLists.data;
  //     provide("messageList", messageList.value);
  //   } catch (err) {
  //     if (err instanceof AxiosError) {
  //       if (err.response && err.response.status === 404) {
  //         error.value = "Not found";
  //       } else {
  //         error.value = "An error occurred";
  //       }
  //     } else {
  //       error.value = "An unexpected error occurred";
  //     }
  //   }
</script>
