<template>
  <q-card class="text-editor" flat>
    <editor-content :editable="false" :editor="editor" class="q-pa-sm" />
  </q-card>
</template>

<script setup lang="ts">
  import Link from "@tiptap/extension-link";

  import { useEditor, EditorContent } from "@tiptap/vue-3";

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

  const editor = useEditor({
    //content:
    // '<p><a target="_blank" rel="noopener noreferrer nofollow" href="http://google.com">google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.google.com">www.google.com</a></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://test.com">http://test.com</a></p>',
    content: props.modelValue,
    extensions: [Link],
    onUpdate: () => {
      if (editor.value) {
        emit("update:modelValue", editor.value.getHTML());
      }
    }
  });
</script>

<style lang="scss">
  .text-editor {
    .contentHeight {
      height: 100%;
      overflow: auto;
    }
  }
</style>

<style lang="scss">
  .q-list .q-item.q-focusable.q-hoverable.active {
    background: #e8f5e9 !important;
  }
  .q-card.q-card--bordered.q-card--flat.no-shadow.text-editor {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
  .text-editor {
    .q-scrollarea {
      cursor: text;
    }
    .ProseMirror {
      outline: none;
      height: calc(76vh - 250px);

      > * + * {
        margin-top: 0.75em;
      }

      p {
        font-size: 1rem;
        line-height: 1.2rem;
      }

      code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
      }

      h1 {
        font-size: 6rem;
      }

      h2 {
        font-size: 3.75rem;
      }

      h3 {
        font-size: 3rem;
      }

      h4 {
        font-size: 2.125rem;
      }

      h5 {
        font-size: 1.5rem;
      }
      h6 {
        font-size: 1.25rem;
      }
    }
  }
</style>
