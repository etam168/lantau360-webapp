<template>
  <div class="text-center" @click="onItemClick()">
    <q-avatar size="64px">
      <q-img :src="directoryIcon" />
    </q-avatar>
    <div class="text-center q-ma-sm">
      {{ directoryTitle }}
    </div>
  </div>
</template>

<script setup lang="ts">
  // interface files
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";

  // .ts file
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";

  const emit = defineEmits(["on-click"]);

  const props = defineProps({
    item: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    }
  });

  function isCommunityDirectory(item: DirectoryTypes): item is CommunityDirectory {
    return (item as CommunityDirectory).imagePath !== undefined;
  }

  const directoryIcon = computed(() => {
    const imagePath = props.item.imagePath;
    const filePath = props.item.meta?.["file-path"];

    const icon = isCommunityDirectory(props.item)
      ? imagePath != null
        ? imagePath.includes("http")
          ? imagePath
          : `${BLOB_URL}/${imagePath}`
        : null
      : filePath != null
        ? filePath
        : null;

    // If icon is not null, return it; otherwise, return the placeholder URL
    return icon || PLACEHOLDER_THUMBNAIL;
  });

  const { translateAlt, translate } = useUtilities();
  const directoryTitle = computed(() => {
    const { directoryName, directoryNameAlt } = props.item as CommunityDirectory;

    // Check if directoryNameAlt exists and is not null
    if (directoryNameAlt !== undefined && directoryNameAlt !== null) {
      return translateAlt(directoryName, directoryNameAlt, "directoryName");
    } else {
      return translate(directoryName, props.item.meta, "directoryName");
    }
  });

  function onItemClick() {
    emit("on-click", props.item);
  }
</script>
