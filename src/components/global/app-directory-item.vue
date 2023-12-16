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
  // .ts file
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory"; // import the CommunityDirectory
  import { Directory } from "@/interfaces/models/entities/directory";
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";

  type DirectoryTypes = Directory | CommunityDirectory;

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

  const directoryIcon = computed(() =>
    isCommunityDirectory(props.item)
      ? `${BLOB_URL}/${props.item.imagePath}`
      : props.item.meta?.["file-path"] || PLACEHOLDER_THUMBNAIL
  );

  const { translate } = useUtilities();

  const directoryTitle = computed(() => {
    return translate(props.item.directoryName, props.item.meta, "directoryName");
  });

  function onItemClick() {
    emit("on-click", props.item);
  }
</script>
