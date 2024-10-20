<template>
  <q-page>
    <template v-for="(item, index) in renderItems" :key="index">
      <checkin-section
        v-if="item.type === 'checkin'"
        :contentData="contentData[contentName.toUpperCase()]"
      />
      <content-section
        v-else-if="item.type === 'content'"
        :contentData="contentData[contentName.toUpperCase()]"
      />
      <account-section
        v-else-if="item.type === 'account'"
        :contentData="contentData[contentName.toUpperCase()]"
      />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/stores/user";
  import { ENTITY_URL, EntityURLKey, MENU } from "@/constants";
  import { useChangeCase } from "@vueuse/integrations/useChangeCase";

  import AccountSection from "./section/account-section.vue";
  import checkinSection from "./section/checkin-section.vue";
  import ContentSection from "./section/content-section.vue";

  const isLoading = defineModel("isLoading", { type: Boolean });

  // Props
  const { contentName } = defineProps<{
    contentName: string;
    entityKey?: EntityURLKey;
  }>();

  const { fetchData } = useApi();
  const userStore = useUserStore();
  const isDialogVisible = ref();

  const contentData = ref<Record<string, any>>({});

  const fetchAllData = async () => {
    const contentKey = useChangeCase(contentName, "capitalCase").value;
    try {
      switch (contentName) {
        case MENU.PRIVACY:
          contentData.value.PRIVACY = await fetchData(`${ENTITY_URL.CONTENT_NAME}/${contentKey}`);
          isLoading.value = false;
          break;
        case MENU.TERMS:
          contentData.value.TERMS = await fetchData(`${ENTITY_URL.CONTENT_NAME}/${contentKey}`);
          break;
        case MENU.ACCOUNT:
          contentData.value.ACCOUNT = await fetchData(
            `${ENTITY_URL.CHECKIN_BY_MEMBER}/${userStore.userId}`
          );
          break;
        case MENU.CHECKIN:
          contentData.value.CHECKIN = await fetchData(
            `${ENTITY_URL.CHECKIN_BY_MEMBER}/${userStore.userId}`
          );

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
    type: "account" | "checkin" | "content";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (contentName) {
      case MENU.ACCOUNT:
        return [{ name: "account", type: "account" }];
      case MENU.CHECKIN:
        return [{ name: "checkin", type: "checkin" }];
      case MENU.PRIVACY:
      case MENU.TERMS:
        return [{ name: "content", type: "content" }];

      default:
        return [];
    }
  });

  await fetchAllData();
</script>
