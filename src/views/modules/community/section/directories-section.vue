<template>
  <q-list class="row">
    <q-item
      clickable
      v-for="item in data.slice(0, 8)"
      :key="item.communityDirectoryId"
      class="col-3"
      @click="onItemClick(item)"
    >
      <q-item-section class="row justify-center items-center">
        <q-item-label>
          <q-item-section top avatar class="q-pr-none justify-center items-center">
            <q-avatar>
              <img :src="computeImagePath(item.imagePath)" />
            </q-avatar>
          </q-item-section>
        </q-item-label>
        <q-item-label>{{ item.shortName }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
  // Vue Import
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { PropType } from "vue";

  // .ts file
  import { useRouter } from "vue-router";
  defineProps({
    data: {
      type: Object as PropType<any[]>,
      required: true
    }
  });

  const router = useRouter();

  function computeImagePath(imagePath: any) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }
  const onItemClick = (value: any) => {
    router.push({
      name: "community-list",
      query: { directoryId: value.communityDirectoryId }
    });
  };
</script>
