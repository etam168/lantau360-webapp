<template>
  <q-img
    v-bind="$attrs"
    :placeholder-src="PLACEHOLDER_THUMBNAIL"
    :src="imagelink == null ? PLACEHOLDER_THUMBNAIL : imagelink"
  >
    <template v-slot:error>
      <q-img :src="PLACEHOLDER_THUMBNAIL" />
    </template>

    <template v-slot:loading>
      <div class="absolute-full flex flex-center bg-gray text-white">
        <q-inner-loading showing class="spinner-card row justify-center items-center">
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>
      </div>
    </template>
  </q-img>
</template>

<script setup lang="ts">
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  defineProps({
    imagelink: {
      type: String
    }
  });
</script>
