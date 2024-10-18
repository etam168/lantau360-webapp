<template>
  <q-item>
    <div v-html="translate(entityOptions.contentData, entityOptions.meta, 'contentData')"></div
  ></q-item>
</template>

<script setup lang="ts">
  // Composables Imports
  import { ENTITY_URL } from "@/constants";
  import { useChangeCase } from "@vueuse/integrations/useChangeCase";

  // Props
  const { category } = defineProps<{
    category: any;
  }>();

  const { translate } = useUtilities();
  const { api } = useApi();
  const entityOptions = ref<Record<string, any>>({});
  const moreData = ref();
  const isDialogVisible = ref();

  const fetchContentData = async () => {
    const contentKey = useChangeCase(category.name, "capitalCase").value;
    try {
      let requestUrl;

      requestUrl = `${ENTITY_URL.CONTENT_NAME}/${contentKey}`;
      const response = await api.get(requestUrl);
      entityOptions.value = response.data;
      isDialogVisible.value = true;
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  await fetchContentData();
</script>
