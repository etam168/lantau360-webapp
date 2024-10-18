<template>
  <q-page>
    <template v-for="(item, index) in renderItems" :key="index">
      <gallery-image-list v-if="item.type === 'carousel'" :image-list="galleryItems" />
      <checkin-section v-if="item.type === 'checkin'" :moreData="moreData" />
      <content-section v-else-if="item.type === 'content'" :moreData="moreData" />
      <profile-section v-else-if="item.type === 'profile'" :moreData="moreData" />
      <point-balance-section v-else-if="item.type === 'point-balance'" :moreData="moreData" />
      <transactions-tabs-section
        v-else-if="item.type === 'transactions-tabs'"
        :moreData="moreData"
      />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  import { ENTITY_URL, MENU } from "@/constants";
  import { useUserStore } from "@/stores/user";
  import { useChangeCase } from "@vueuse/integrations/useChangeCase";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  import CheckinSection from "./section/checkin-section.vue";
  import ContentSection from "./section/content-section.vue";
  import ProfileSection from "./section/profile-section.vue";
  import PointBalanceSection from "./section/point-balance-section.vue";
  import TransactionsTabsSection from "./section/transactions-tabs-section.vue";

  // Props
  const { category } = defineProps<{
    category: any;
  }>();

  const userStore = useUserStore();
  const { api } = useApi();

  const isDialogVisible = ref();
  const moreData = ref();
  const galleryItems = ref<GalleryImageType[]>([]);

  const fetchAllData = async () => {
    const contentKey = useChangeCase(category.name, "capitalCase").value;
    try {
      let requestUrl;
      switch (category.name) {
        case MENU.ACCOUNT:
          requestUrl = `${ENTITY_URL.CHECKIN_BY_MEMBER}/${userStore.userId}`;
          break;
        case MENU.PRIVACY:
        case MENU.TERMS:
          requestUrl = `${ENTITY_URL.CONTENT_NAME}/${contentKey}`;
          break;
        case MENU.PROFILE:
          requestUrl = `${ENTITY_URL.MEMBER_BY_ID}/${userStore.userId}`;
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
      isDialogVisible.value = true;
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  interface RenderItem {
    name: string;
    type: "carousel" | "content" | "checkin" | "profile" | "point-balance" | "transactions-tabs";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (category.name) {
      case MENU.ACCOUNT:
        return [
          { name: "point-balance", type: "point-balance" },
          { name: "transactions-tabs", type: "transactions-tabs" }
        ];
      case MENU.PRIVACY:
      case MENU.TERMS:
        return [{ name: "content", type: "content" }];
      case MENU.CHECKIN:
        return [{ name: "checkin", type: "checkin" }];
      case MENU.PROFILE:
        return [{ name: "profile", type: "profile" }];
      default:
        return [];
    }
  });

  await fetchAllData();
</script>
