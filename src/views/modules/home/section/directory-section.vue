<template>
  <q-card-section class="bg-transparent">
    <div class="row">
      <div :class="classMenuItem" v-for="item in data" :key="item.directoryId">
        <div @click="onItemClick(item)">
          <directory-item :data="item" />
        </div>
      </div>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, computed } from "vue";

  import { Screen } from "quasar";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { useRouter } from "vue-router";

  //Custom Components
  import DirectoryItem from "@/components/custom/directory-item.vue";

  defineProps({
    data: {
      type: Object as PropType<Directory[]>,
      required: true
    }
  });

  const router = useRouter();

  const classMenuItem = computed((): string => {
    return Screen.gt.xs ? "col-3" : "col-4";
  });

  const onItemClick = (value: any) => {
    router.push({
      name: "site-list",
      query: { directoryId: value.directoryId }
    });
  };
</script>
