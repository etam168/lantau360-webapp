<template>
  <q-card v-if="data != null" class="q-ma-md" flat>
    <q-toolbar class="bg-primary text-white shadow-2 rounded-borders">
      <q-toolbar-title>{{ contentName }} </q-toolbar-title>
      <q-space />

      <q-tabs v-model="tab" shrink stretch>
        <q-tab
          v-for="item in expansionItems"
          :key="item.name"
          :name="item.name"
          :label="item.label"
        />
      </q-tabs>
    </q-toolbar>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel v-for="item in expansionItems" :key="item.name" :name="item.name">
        <app-text-editor v-model="item.content" :contentHeight="contentHeightDefaultLang" />
      </q-tab-panel>
    </q-tab-panels>

    <q-card-actions>
      <app-button
        class="q-ma-sm"
        color="primary"
        :label="$t('action.save')"
        @click="onSaveContent()"
      />
    </q-card-actions>
  </q-card>

  <div v-if="error">
    <h3>Error:</h3>
    <pre>{{ error }}</pre>
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, reactive, onMounted } from "vue";

  import axios, { AxiosError } from "axios";
  import { Content } from "@/interfaces/content";
  import { useContentInput } from "./use-content-input";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import AppTextEditor from "@/components/widgets/app-text-editor.vue";

  const tab = ref("en");

  const { contentInput, setContentInput, updateContent } = useContentInput();

  // Define the props
  const props = withDefaults(defineProps<{ contentName: string }>(), {
    contentName: "Default"
  });

  onMounted(() => {
    setContentInput(data.value as Content);
  });

  const data = ref<Content | null>(null);
  const error = ref<string | null>(null);

  const contentHeightDefaultLang = ref("calc(100vh - 457px)");
  const expansionItems = reactive([
    {
      name: "en",
      content: "",
      label: "English Version"
    },
    {
      name: "hk",
      content: "",
      label: "繁體版本"
    },
    {
      name: "cn",
      content: "",
      label: "简体版本"
    }
  ]);

  //const openedItem = ref(0);

  // function toggleItem(index: number, expanded: boolean) {
  //   if (!expanded) {
  //     openedItem.value = (index + 1) % 2;
  //   } else {
  //     openedItem.value = index;
  //   }
  //   expansionItems.forEach((item, i) => {
  //     item.opened = i === openedItem.value;
  //   });
  // }

  async function onSaveContent() {
    contentInput.value.contentData = expansionItems[0].content;

    if (typeof contentInput.value.meta === "string") {
      contentInput.value.meta = {};
    }

    contentInput.value.meta ??= {};
    contentInput.value.meta.i18n ??= {};
    contentInput.value.meta.i18n["hk"] ??= {};
    contentInput.value.meta.i18n["hk"]["contentData"] = expansionItems[1].content;
    contentInput.value.meta.i18n["cn"] ??= {};
    contentInput.value.meta.i18n["cn"]["contentData"] = expansionItems[2].content;
    updateContent();
  }

  try {
    const url = `/Content/ContentByName/${props.contentName}`;
    const response = await axios.get<Content>(url);
    data.value = response.data;

    expansionItems[0].content = data.value.contentData;
    expansionItems[1].content = data.value.meta?.i18n?.hk?.contentData as string;
    expansionItems[2].content = data.value.meta?.i18n?.cn?.contentData as string;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.status === 404) {
        error.value = "Not found";
      } else {
        error.value = "An error occurred";
      }
    } else {
      error.value = "An unexpected error occurred";
    }
  }
</script>
