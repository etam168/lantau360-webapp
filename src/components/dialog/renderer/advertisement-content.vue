<template>
  <q-item>
    <editor-content :editable="isEditable" :editor="editor"></editor-content>
  </q-item>
</template>

<script setup lang="ts">
  // .ts files
  import { EventBus } from "quasar";

  import CharacterCount from "@tiptap/extension-character-count";
  import Image from "@tiptap/extension-image";
  import Link from "@tiptap/extension-link";
  import StarterKit from "@tiptap/starter-kit";
  import Subscript from "@tiptap/extension-subscript";
  import Superscript from "@tiptap/extension-superscript";
  import TextAlign from "@tiptap/extension-text-align";
  import Underline from "@tiptap/extension-underline";

  import { Advertisement } from "@/interfaces/models/entities/advertisement";
  import { EmojiReplacer, IconReplacer } from "@/components/global/editor/extensions";
  import { MarketingType } from "@/interfaces/types/marketing-types";
  import { useEditor, EditorContent } from "@tiptap/vue-3";

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

  const { translate } = useUtilities();

  const editor = useEditor({
    content: "",
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      Link,
      Image.configure({ inline: true }),
      CharacterCount.configure({}),
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      EmojiReplacer,
      IconReplacer
    ]
  });

  const isDialogVisible = ref();
  const isEditable = ref(false);

  onMounted(() => {
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });

    editor?.value?.setEditable(isEditable.value);

    const translatedContent = translate(
      advertisementItem.value["description"],
      advertisementItem.value.meta,
      "description"
    );

    editor.value?.commands.setContent(translatedContent, false);
  });
</script>
