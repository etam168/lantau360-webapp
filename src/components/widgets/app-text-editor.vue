<template>
  <q-card class="text-editor" bordered flat>
    <q-card-section class="row" v-if="editor">
      <q-btn-dropdown flat :label="textHeading">
        <q-list>
          <q-item
            v-for="index in 6"
            :key="index"
            clickable
            v-close-popup
            dense
            :class="{ active: editor.isActive('heading', { level: index }) }"
            :style="{ fontSize: 20 - index + 'px' }"
            @click="onHeadingClick(index)"
          >
            <q-item-section>
              <q-item-label>H{{ index }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn
        v-for="({ slug, option, active, icon }, index) in textActions"
        :key="index"
        flat
        dense
        size="12px"
        :class="{ active: editor.isActive(active) }"
        @click="onActionClick(slug, option)"
        :icon="icon"
      >
      </q-btn>
    </q-card-section>
    <q-separator />
    <q-scroll-area :style="{ height: contentHeight }">
      <editor-content :editor="editor" class="q-pa-sm" />
    </q-scroll-area>

    <q-card-section
      v-if="editor"
      class="q-pa-sm text-right text-primary"
      :class="maxLimit ? limitWarning : ''"
    >
      {{ charactersCount }} {{ maxLimit ? `/ ${maxLimit} characters` : "characters" }}
      |
      {{ wordsCount }} words
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

  import StarterKit from "@tiptap/starter-kit";
  import TextAlign from "@tiptap/extension-text-align";
  import Underline from "@tiptap/extension-underline";
  import Subscript from "@tiptap/extension-subscript";
  import Superscript from "@tiptap/extension-superscript";
  import CharacterCount from "@tiptap/extension-character-count";

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
    content: "",
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      CharacterCount.configure({
        limit: props.maxLimit
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"]
      })
    ],
    onUpdate: () => {
      if (editor.value) {
        emit("update:modelValue", editor.value.getHTML());
      }
    }
  });

  const textHeading = ref("Heading");

  const charactersCount = computed(() => {
    return editor.value?.storage.characterCount.characters();
  });

  const wordsCount = computed(() => {
    return editor.value?.storage.characterCount.words();
  });

  const limitWarning = computed(() => {
    if (props.maxLimit === null) return "";

    const isCloseToMax = charactersCount.value >= props.maxLimit - 20;
    const isMax = charactersCount.value === props.maxLimit;

    if (isCloseToMax && !isMax) return "warning";
    if (isMax) return "danger";

    return "";
  });

  const textActions = ref([
    { slug: "bold", icon: "format_bold", active: "bold" },
    { slug: "italic", icon: "format_italic", active: "italic" },
    { slug: "underline", icon: "format_underlined", active: "underline" },
    { slug: "bulletList", icon: "format_list_bulleted", active: "bulletList" },
    { slug: "orderedList", icon: "format_list_numbered", active: "orderedList" },
    { slug: "subscript", icon: "subscript", active: "subscript" },
    { slug: "superscript", icon: "superscript", active: "superscript" },
    // { slug: "strike", icon: "format_strikethrough", active: "strike" },
    {
      slug: "align",
      option: "left",
      icon: "format_align_left",
      active: { textAlign: "left" }
    },
    {
      slug: "align",
      option: "center",
      icon: "format_align_center",
      active: { textAlign: "center" }
    },
    {
      slug: "align",
      option: "right",
      icon: "format_align_right",
      active: { textAlign: "right" }
    },
    {
      slug: "align",
      option: "justify",
      icon: "format_align_justify",
      active: { textAlign: "justify" }
    }

    // { slug: "undo", icon: "arrow-left", active: "undo" },
    // { slug: "redo", icon: "arrow-right", active: "redo" },
    // { slug: "clear", icon: "format_clear", active: "clear" }
  ]);

  function onActionClick(slug: string, option: string | null = null) {
    const vm = editor.value?.chain().focus();

    if (!vm) {
      // console.error("Editor is not available.");
      return;
    }

    const actionTriggers: { [key: string]: () => void } = {
      bold: () => vm.toggleBold().run(),
      italic: () => vm.toggleItalic().run(),
      underline: () => vm.toggleUnderline().run(),
      bulletList: () => vm.toggleBulletList().run(),
      orderedList: () => vm.toggleOrderedList().run(),
      subscript: () => vm.toggleSubscript().run(),
      superscript: () => vm.toggleSuperscript().run(),
      align: () => {
        if (option !== null) {
          vm.setTextAlign(option).run();
        }
      },
      clear: () => {
        vm.clearNodes().run();
        vm.unsetAllMarks().run();
      }
    };

    if (slug in actionTriggers) {
      actionTriggers[slug]();
    } else {
      // console.error(`Invalid action: ${slug}`);
    }
  }

  function onHeadingClick(index: any) {
    const vm = editor.value?.chain().focus();

    if (vm) {
      vm.toggleHeading({ level: index }).run();
      // textHeading.value = "H" + index;
    } else {
      // console.error("Editor is not available.");
    }
  }

  watch(
    () => props.modelValue,
    newVal => {
      if (editor.value?.getHTML() === newVal) return;
      editor.value?.commands.setContent(props.modelValue, false);
    }
  );

  onMounted(() => {
    editor.value?.commands.setContent(props.modelValue, false);
  });

  onBeforeUnmount(() => {
    editor.value?.destroy();
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
