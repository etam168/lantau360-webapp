<template>
  <div class="text-center" @click="onItemClick()">
    <q-avatar size="64px">
      <q-img :src="getImageURL(props.item.imagePath)" />
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

  const emit = defineEmits(["on-click"]);

  const props = defineProps({
    item: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    }
  });

  const { getImageURL, translateAlt, translate } = useUtilities();

  const directoryTitle = computed(() => {
    const { shortName, shortNameAlt } = props.item as CommunityDirectory;

    // Check if directoryNameAlt exists and is not null
    if (shortNameAlt !== undefined && shortNameAlt !== null) {
      return translateAlt(shortName, shortNameAlt, "shortName");
    } else {
      return translate(shortName, props.item.meta, "shortName");
    }
  });

  function onItemClick() {
    emit("on-click", props.item);
  }
</script>
