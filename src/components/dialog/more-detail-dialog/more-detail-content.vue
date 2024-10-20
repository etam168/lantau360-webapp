<template>
  <q-page>
    <app-html-item 
      v-if="contentData"
      :contentData="translatedContent"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineModel } from "vue";
import { ENTITY_URL, EntityURLKey, MENU } from "@/constants";
import { useChangeCase } from "@vueuse/integrations/useChangeCase";

const isLoading = defineModel("isLoading", { type: Boolean });

const props = defineProps<{
  contentName: string;
  entityKey?: EntityURLKey;
}>();

const { translate } = useUtilities();
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
  return null;
});

// Fetch data when component is created
fetchContent();
</script>