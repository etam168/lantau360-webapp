<template>
  <div v-if="data.directoryId" class="text-center" @click="onDialog()">
    <q-avatar size="64px">
      <q-img :src="directoryIcon" />
    </q-avatar>
    <div class="text-center q-ma-sm">
      {{ directoryTitle }}
    </div>
  </div>
  <div v-else class="text-center" @click="onItemClick()">
    <q-btn outline round color="grey">
      <q-avatar size="64px">
        <q-img :src="communityDirectoryIcon" />
      </q-avatar>
    </q-btn>
    <div class="text-center q-ma-sm">
      {{ directoryTitle }}
    </div>
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";
  import { useI18n } from "vue-i18n";

  // Custom Components
  import { BLOB_URL } from "@/constants";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";
  import { computed } from "vue";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  const emit = defineEmits(["on-dialog", "on-click"]);

  const props = defineProps({
    data: {
      type: Object as PropType<Directory>,
      required: true
    }
  });

  const communityDirectoryIcon = computed(() => {
    return props.data.imagePath ? `${BLOB_URL}/${props.data.imagePath}` : PLACEHOLDER_THUMBNAIL;
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

  function onDialog() {
    emit("on-dialog", props.data);
  }

  function onItemClick() {
    emit("on-click", props.data);
  }
</script>
