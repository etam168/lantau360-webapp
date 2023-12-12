<template>
  <q-card v-if="data != null" class="q-ma-sm" flat>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel
        v-for="item in expansionItems"
        :key="item.name"
        :name="item.name"
        class="q-pa-none"
      >
        <q-editor
          v-model="item.content"
          :contentHeight="contentHeightDefaultLang"
          :toolbar="[]"
          class="q-pa-none"
        />
      </q-tab-panel>
    </q-tab-panels>
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
  import { Content } from "@/interfaces/models/entities/content";
  import { useContentInput } from "./use-content-input";

  const tab = ref("en");
  const { setContentInput } = useContentInput();

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
