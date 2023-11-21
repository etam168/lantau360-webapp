<template>
  <editor-content :editor="editor" />
</template>

<script lang="ts">
  import { defineComponent, onBeforeUnmount, watch } from "vue";

  import StarterKit from "@tiptap/starter-kit";

  import { useEditor, EditorContent } from "@tiptap/vue-3";

  export default defineComponent({
    components: {
      EditorContent
    },

    props: {
      modelValue: {
        type: String,
        default: ""
      }
    },

    emits: ["update:modelValue"],

    setup(props, ctx) {
      const editor = useEditor({
        content: props.modelValue,
        extensions: [StarterKit],
        editable: false,
        onUpdate: () => {
          ctx.emit("update:modelValue", editor.value.getHTML());
        }
      });

      watch(
        () => props.modelValue,
        newVal => {
          // HTML
          const isSame = editor.value.getHTML() === newVal;

          if (!isSame) {
            editor.value?.commands.setContent(props.modelValue, false);
          }
        }
      );

      onBeforeUnmount(() => {
        editor.value?.destroy();
      });

      return {
        editor
      };
    }
  });
</script>

<style lang="scss">
  /* Basic editor styles */
  .ProseMirror {
    font-family: "Baloo";

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
  }
</style>
