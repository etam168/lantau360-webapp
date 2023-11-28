<template>
  <div class="text-center">
    <q-avatar v-if="data && data.meta && data.meta['file-path']">
      <q-img :src="data.meta['file-path']" />
    </q-avatar>
    <q-avatar v-else>
      <q-img :src="PLACEHOLDER_THUMBNAIL" />
    </q-avatar>
  </div>
  <div class="text-center q-ma-sm">
    {{ getTitle(data.directoryName, data.meta, "directoryName") }}
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";
  import { useI18n } from "vue-i18n";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  defineProps({
    data: {
      type: Object as PropType<Directory>,
      required: true
    }
  });

  const getTitle = (label: string, meta: any, key: string) => {
    const { locale } = useI18n({ useScope: "global" });
    switch (locale.value) {
      case "hk":
        return meta?.i18n?.hk?.[key] ?? label;
      case "cn":
        return meta?.i18n?.cn?.[key] ?? label;
      default:
        return label;
    }
  };
</script>
