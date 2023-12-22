<template>
  <q-item>
    <editor-content :editable="isEditable" :editor="editor"></editor-content>
  </q-item>
</template>

<script setup lang="ts">
  // .ts files
  import { EventBus } from "quasar";

  import { useEditor, EditorContent } from "@tiptap/vue-3";
  import Link from "@tiptap/extension-link";
  import StarterKit from "@tiptap/starter-kit";
  import { Advertisement } from "@/interfaces/models/entities/advertisement";
  import { MarketingType } from "@/interfaces/types/marketing-types";

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const eventBus = new EventBus();
  const advertisementItem = computed(() => {
    return props.item as Advertisement;
  });

  const editor = useEditor({
    content: "",
    extensions: [StarterKit, Link]
  });

  const isDialogVisible = ref();
  const isEditable = ref(false);
  //const setIsEditable = ref(false);

  onMounted(() => {
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });

    editor?.value?.setEditable(isEditable.value);

    // const data =
    //   '<p><a target="_blank" rel="noopener noreferrer nofollow" href="http://google.com">google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.google.com">www.google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://test.com">http://test.com</a></p>';
    editor.value?.commands.setContent(advertisementItem.value.description, false);
  });
</script>
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
