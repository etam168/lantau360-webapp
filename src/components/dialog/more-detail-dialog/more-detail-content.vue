<template>
  <q-page>
    <template v-for="(item, index) in renderItems" :key="index">
      <checkin-section v-if="item.type === 'checkin'" :moreData="moreData" />
      <content-section v-else-if="item.type === 'content'" :moreData="moreData" />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  import { ENTITY_URL, MENU } from "@/constants";
  import { useUserStore } from "@/stores/user";
  import { useChangeCase } from "@vueuse/integrations/useChangeCase";

  import CheckinSection from "./section/checkin-section.vue";
  import ContentSection from "./section/content-section.vue";

  // Props
  const { category } = defineProps<{
    category: any;
  }>();

  const { translate } = useUtilities();
  const userStore = useUserStore();
  const { api } = useApi();

  const isDialogVisible = ref();
  const moreData = ref();

  const fetchAllData = async () => {
    const contentKey = useChangeCase(category.name, "capitalCase").value;
    try {
      let requestUrl;
      switch (category.name) {
        case MENU.PRIVACY:
        case MENU.TERMS:
          requestUrl = `${ENTITY_URL.CONTENT_NAME}/${contentKey}`;
          break;
        case MENU.PROFILE:
          requestUrl = `${ENTITY_URL.MEMBER}/${userStore.userId}`;
          break;
        case MENU.CHECKIN:
          requestUrl = `${ENTITY_URL.CHECKIN_BY_MEMBER}/${userStore.userId}`;
          break;
        default:
          requestUrl = `${ENTITY_URL.CHECKIN_BY_MEMBER}/${userStore.userId}`;
          break;
      }

      const response = await api.get(requestUrl);
      moreData.value = response.data;
      alert(JSON.stringify(moreData.value));
      isDialogVisible.value = true;
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  interface RenderItem {
    name: string;
    type: "content" | "checkin";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (category.name) {
      case MENU.PRIVACY:
      case MENU.TERMS:
        return [{ name: "content", type: "content" }];
      case MENU.CHECKIN:
        return [{ name: "checkin", type: "checkin" }];
      default:
        return [];
    }
  });

  //   async function OpenDialog(
  //     component: any,
  //     componentProps?: any,
  //     contentKey?: string,
  //     requestType?: string
  //   ) {
  //     let requestUrl;
  //     switch (requestType) {
  //       case "content":
  //         requestUrl = `${ENTITY_URL.CONTENT_NAME}/${contentKey}`;
  //         break;
  //       case "profile":
  //         requestUrl = `${ENTITY_URL.MEMBER}/${userStore.userId}`;
  //         break;
  //       default:
  //         requestUrl = `${ENTITY_URL.CHECKIN_BY_MEMBER}/${userStore.userId}`;
  //         break;
  //     }
  //     const response = await axios.get(requestUrl).catch(err => {
  //       handleError(err);
  //     });

  //     $q.dialog({
  //       component: defineAsyncComponent(() => component),
  //       componentProps: {
  //         data: response?.data || [],
  //         ...componentProps
  //       }
  //     });
  //   }

  await fetchAllData();
</script>
