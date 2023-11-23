<template>
  <q-list class="row">
    <q-item clickable v-for="items in data.slice(0, 8)" :key="items.directoryId" class="col-3">
      <q-item-section class="row justify-center items-center">
        <q-item-label>
          <q-item-section top avatar class="q-pr-none justify-center items-center">
            <q-avatar>
              <img :src="items?.meta['file-path']" />
            </q-avatar>
          </q-item-section>
        </q-item-label>
        <q-item-label>{{ items.directoryName }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  defineProps({
    data: {
      type: Object as PropType<Directory[]>,
      required: true
    }
  });
</script>
