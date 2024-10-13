<template>
  <editor-content :editable="isEditable" :editor="editor" />
</template>

<script setup lang="ts">
  // Vue Import
  import { onBeforeUnmount, onMounted, ref } from "vue";

  import Link from "@tiptap/extension-link";
  import StarterKit from "@tiptap/starter-kit";
  import TextAlign from "@tiptap/extension-text-align";
  import Underline from "@tiptap/extension-underline";
  import Subscript from "@tiptap/extension-subscript";
  import Superscript from "@tiptap/extension-superscript";
  import CharacterCount from "@tiptap/extension-character-count";
  import Image from "@tiptap/extension-image";
  // import { CustomLinkExtension } from "../../extension/CustomLinkExtension"; Image with hhtp link extension
  import { useEditor, EditorContent } from "@tiptap/vue-3";

  // Extensions
  import { TipTapIcon } from "@/components/extensions";

  const props = defineProps({
    modelValue: {
      type: String,
      default: ""
    },
    maxLimit: {
      type: Number,
      default: null
    },
    contentHeight: {
      type: String,
      default: ""
    }
  });
  const emit = defineEmits(["update:modelValue"]);
  const isEditable = ref(true);

  const editor = useEditor({
    content: "",
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      Link,
      Image.configure({ inline: true }),
      CharacterCount.configure({
        limit: props.maxLimit
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      TipTapIcon
    ],
    onUpdate: () => {
      if (editor.value) {
        emit("update:modelValue", editor.value.getHTML());
      }
    }
  });
  onMounted(() => {
    editor?.value?.setEditable(false);
    editor.value?.commands.setContent(props.modelValue, false);
  });

  onBeforeUnmount(() => {
    editor.value?.destroy();
  });
</script>
