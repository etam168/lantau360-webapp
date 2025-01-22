<template>
  <q-page>
    <app-html-item v-if="contentData" :contentData="translatedContent" />
  </q-page>
</template>

<script setup lang="ts">
  // Constants
  import { ENTITY_URL, EntityURLKey, MENU } from "@/constants";
  import { useChangeCase } from "@vueuse/integrations/useChangeCase";

  // Model
  const isLoading = defineModel("isLoading", { type: Boolean });

  // Props
  const props = defineProps<{
    contentName: string;
    entityKey?: EntityURLKey;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });
  const { translate } = useUtilities(locale.value);
  const { fetchData } = useApi();

  const contentData = ref<Record<string, any> | null>(null);

  const fetchContent = async () => {
    const contentKey = useChangeCase(props.contentName, "capitalCase").value;
    try {
      if (props.contentName === MENU.PRIVACY || props.contentName === MENU.TERMS) {
        const data = await fetchData(`${ENTITY_URL.CONTENT_NAME}/${contentKey}`);
        contentData.value = data;
        if (props.contentName === MENU.PRIVACY) {
          isLoading.value = false;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const translatedContent = computed(() => {
    if (contentData.value) {
      return translate(contentData.value.contentData, contentData.value.meta, "contentData");
    }
    return {};
  });

  /**
   * Fetch Content as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchContent();
</script>
