<template>
  <q-list class="row">
    <q-item
      clickable
      v-for="directory in data"
      :key="directory.directoryId"
      class="col-4"
      @click="onItemClick(directory)"
    >
      <q-item-section class="row justify-center items-center">
        <q-item-label>
          <q-item-section top avatar class="q-pr-none justify-center items-center">
            <q-avatar>
              <img :src="directory?.meta['file-path']" />
            </q-avatar>
          </q-item-section>
        </q-item-label>
        <q-item-label>{{ directory.directoryName }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { useRouter } from "vue-router";

  defineProps({
    data: {
      type: Object as PropType<Directory[]>,
      required: true
    }
  });

  const router = useRouter();

  const onItemClick = (value: any) => {
    router.push({ name: "directory-items", query: { directoryId: value.directoryId } });
  };
</script>
