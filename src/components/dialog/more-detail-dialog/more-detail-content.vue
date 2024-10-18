<template>
  <q-page>
    <template v-for="(item, index) in renderItems" :key="index">
      <content-section
        v-if="item.type === 'content'"
        :contentData="contentData[contentName.toUpperCase()]"
      />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  import { ENTITY_URL, MENU } from "@/constants";
  import { useChangeCase } from "@vueuse/integrations/useChangeCase";

  import ContentSection from "./section/content-section.vue";

  // Props
  const { contentName } = defineProps<{
    contentName: string;
  }>();

  const { fetchData } = useApi();

  const isDialogVisible = ref();

  const contentData = ref<Record<string, any>>({});

  const fetchAllData = async () => {
    const contentKey = useChangeCase(contentName, "capitalCase").value;
    try {
      switch (contentName) {
        case MENU.PRIVACY:
          contentData.value.PRIVACY = await fetchData(`${ENTITY_URL.CONTENT_NAME}/${contentKey}`);
          break;
        case MENU.TERMS:
          contentData.value.TERMS = await fetchData(`${ENTITY_URL.CONTENT_NAME}/${contentKey}`);
          break;

        default:
          "";
          break;
      }
      isDialogVisible.value = true;
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  interface RenderItem {
    name: string;
    type: "content";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (contentName) {
      case MENU.PRIVACY:
      case MENU.TERMS:
        return [{ name: "content", type: "content" }];
      default:
        return [];
    }
  });

  await fetchAllData();
</script>
