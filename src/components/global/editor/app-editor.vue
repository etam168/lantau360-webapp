<template>
  <q-card v-if="isEditable" class="text-editor" bordered flat>
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
      <editor-content :editor="editor" />
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
  <editor-content v-else :editor="editor" />

  <q-file
    ref="imageRef"
    accept="image/*"
    v-show="false"
    v-model="imagePath"
    @update:model-value="onUploadImage"
  />
</template>

<script setup lang="ts">
  import Link from "@tiptap/extension-link";
  import StarterKit from "@tiptap/starter-kit";
  import TextAlign from "@tiptap/extension-text-align";
  import Underline from "@tiptap/extension-underline";
  import Subscript from "@tiptap/extension-subscript";
  import Superscript from "@tiptap/extension-superscript";
  import CharacterCount from "@tiptap/extension-character-count";
  import Image from "@tiptap/extension-image";
  import { useEditor, EditorContent } from "@tiptap/vue-3";

  const $q = useQuasar();

  import { EmojiReplacer, IconReplacer } from "@/components/global/editor/extensions";

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
    },
    isEditable: {
      type: Boolean,
      default: true
    }
  });
  const emit = defineEmits(["update:modelValue"]);

  const editor = useEditor({
    content: "",
    editable: props.isEditable,
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
      EmojiReplacer,
      IconReplacer
    ],
    onUpdate: () => {
      if (editor.value) {
        emit("update:modelValue", editor.value.getHTML());
      }
    }
  });

  const imagePath = ref();
  const imageRef = ref();
  const fileInputRef: Ref<HTMLElement | null> = ref(null);

  const textHeading = ref("Heading");

  const charactersCount = computed(() => {
    return editor.value?.storage.characterCount.characters();
  });

  async function onUploadImage() {
    const file = imagePath.value;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        insertImageFromLocal(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  function onImageUpload() {
    imageRef.value.pickFiles();
  }
  onMounted(() => {
    fileInputRef.value = document.querySelector("[ref=fileInput]");
  });

  function insertImageFromLocal(imageUrl: any) {
    const vm = editor.value?.chain().focus();
    if (vm) {
      vm.setImage({ src: imageUrl }).run();
    }
  }

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
    },
    {
      slug: "insertImage",
      icon: "insert_photo",
      active: "image"
    },
    {
      slug: "insertFacebookIcon",
      icon: "facebook",
      active: "link"
    },
    {
      slug: "link",
      icon: "link",
      active: "link"
    },
    {
      slug: "unsetLink",
      icon: "link_off",
      active: "unsetLink"
    }
  ]);

  function onActionClick(slug: string, option: string | null = null) {
    const vm = editor.value?.chain().focus();

    if (!vm) {
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
      },
      insertImage: () => {
        onImageUpload();
      },
      link: () => {
        const facebookLink = window.prompt("Enter the Facebook link:");
        vm.setLink({ href: facebookLink ?? "" }).run();
      },
      unsetLink: () => {
        vm.unsetLink().run();
      },
      insertFacebookIcon: () => {
        // Assuming this code is in an async function or a context where you can use the 'await' keyword
        // Open the dialog and get the result
        $q.dialog({
          component: defineAsyncComponent(() => import("../editor/dialogs/icon-dialog.vue")),
          componentProps: {
            callback: (icon: string, iconStyle: string, link?: string) => {
              editor.value?.commands.replaceIcon(icon, iconStyle, link);
            }
          }
        });
      }
    };
    if (slug in actionTriggers) {
      actionTriggers[slug]();
    }
  }
  function onHeadingClick(index: any) {
    const vm = editor.value?.chain().focus();
    if (vm) {
      vm.toggleHeading({ level: index }).run();
      // textHeading.value = "H" + index;
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
  @import "@/css/editor.scss";
</style>
