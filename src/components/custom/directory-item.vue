<template>
  <div class="text-center">
    <q-avatar size="64px">
      <q-img :src="directoryIcon" />
    </q-avatar>
  </div>
  <div class="text-center q-ma-sm">
    <!-- {{ getTitle(data.directoryName, data.meta, "directoryName") }} -->
    {{ directoryTitle }}
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";
  import { useI18n } from "vue-i18n";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { computed } from "vue";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  const props = defineProps({
    data: {
      type: Object as PropType<Directory>,
      required: true
    }
  });

  const directoryIcon = computed(() => {
    return props.data && props.data.meta && props.data.meta["file-path"]
      ? props.data.meta["file-path"]
      : PLACEHOLDER_THUMBNAIL;
  });

  const directoryTitle = computed(() => {
    const { locale } = useI18n({ useScope: "global" });
    switch (locale.value) {
      case "hk":
        return props.data.meta?.i18n?.hk?.["directoryName"] ?? props.data.directoryName;
      case "cn":
        return props.data.meta?.i18n?.cn?.["directoryName"] ?? props.data.directoryName;
      default:
        return props.data.directoryName;
    }
  });
</script>
