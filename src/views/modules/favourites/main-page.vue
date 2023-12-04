<template>
  <q-card-actions align="center">
    <div class="text-h6 text-weight-medium">{{ $t("favourite.title") }}</div>
  </q-card-actions>

  <carousel-section :data="promotions" />

  <q-toolbar class="text-white bg-grey-3">
    <q-chip
      v-for="(tabItem, index) in tabItems"
      :key="index"
      :outline="tab !== tabItem.name"
      color="primary"
      text-color="white"
      clickable
      @click="setTab(tabItem.name)"
    >
      {{ tabItem.label }}
    </q-chip>
  </q-toolbar>

  <div>
    <div v-for="(items, groupName) in filteredGroupedItems" :key="groupName" class="q-ma-lg">
      <q-item-label v-if="tab !== 'business'" class="text-weight-medium text-h6">{{
        groupName
      }}</q-item-label>

      <!-- Display the group name outside the card -->
      <div class="row-cards">
        <q-card
          v-for="item in items"
          :key="item.itemId"
          class="shadow-6 q-mt-sm"
          style="border-radius: 12px"
        >
          <q-item class="q-pa-sm" clickable @click="onItemClick(item)">
            <q-item-section top avatar>
              <q-avatar
                class="q-pa-none"
                size="60px"
                style="border-radius: 0px; border: 1px solid rgba(0, 0, 0, 0.12)"
              >
                <q-img :src="getImageSrc(item.iconPath)" />
                <div :style="getAvatarStyle(item.iconPath)"></div>
              </q-avatar>
            </q-item-section>

            <q-item-section top class="q-mt-md">
              <q-item-label class="text-subtitle1 text-weight-medium">{{
                item.itemName
              }}</q-item-label>
              <q-item-label class="text-caption" lines="1" style="font-family: baloo">
                {{ item.subTitle }}
              </q-item-label>
            </q-item-section>
            <q-item-section side class="q-ma-lg">
              <i class="fa-solid fa-heart text-h6" style="color: green; margin-top: -20px"></i>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { ref, onMounted, computed } from "vue";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { FavoriteItem } from "@/interfaces/models/entities/favoriteItem";
  import { BLOB_URL, DIRECTORY_GROUPS, STORAGE_KEYS, PROMOTION_URL } from "@/constants";
  import { LocalStorage } from "quasar";
  import { useRouter } from "vue-router";
  import { useI18n } from "vue-i18n";

  //const CarouselSection = defineAsyncComponent(() => import("./section/carousel-section.vue"));
  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES));
  const groupedItems = ref<Record<string, FavoriteItem[]>>({});
  const promotions = ref<any | null>(null);
  const error = ref<string | null>(null);
  const router = useRouter();

  const { t } = useI18n({ useScope: "global" });

  const tab = ref("location");

  const tabItems = ref([
    { name: "location", label: t("favourite.tabItems.location") },
    { name: "business", label: t("favourite.tabItems.business") },
    { name: "coupon", label: t("favourite.tabItems.coupon") }
  ]);

  function setTab(val: string) {
    tab.value = val;
  }

  onMounted(() => {
    groupItemsByDirectory();
    console.log(groupedItems);
  });

  const onItemClick = (item: any) => {
    let nextPage = "community-detail";

    switch (item.groupId) {
      case DIRECTORY_GROUPS.HOME:
        nextPage = "site-detail";
        break;
      case DIRECTORY_GROUPS.BUSINESS:
        nextPage = "business-detail";
        break;
    }

    const queryParams = {
      directoryItemId: item.itemId
    };

    router.push({
      name: nextPage,
      query: queryParams
    });
  };

  function groupItemsByDirectory() {
    groupedItems.value = (favoriteItems.value ?? []).reduce(
      (acc: any, item: any) => {
        const { directoryName } = item;
        if (!acc[directoryName]) {
          acc[directoryName] = [];
        }
        acc[directoryName].push(item);
        return acc;
      },
      {} as Record<string, FavoriteItem[]>
    );
  }

  const filteredGroupedItems = computed(() => {
    // Filter groupedItems based on groupId and tab.value
    return Object.keys(groupedItems.value).reduce((acc, groupName) => {
      const items = groupedItems.value[groupName];
      const filteredItems = items.filter(item => {
        if (tab.value === "location") {
          return item.groupId === 1 || item.groupId === 3;
        } else if (tab.value === "business") {
          return item.groupId === 2 || item.groupId === 4;
        }
        return false;
      });

      if (filteredItems.length > 0) {
        acc[groupName] = filteredItems;
      }

      return acc;
    }, {});
  });

  function getImageSrc(imagePath: any) {
    return `${BLOB_URL}/${imagePath}`;
  }
  function getAvatarStyle(iconPath: string | undefined) {
    return {
      width: "100%",
      height: "100%",
      backgroundImage: `url(${getImageSrc(iconPath)})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    };
  }

  try {
    const [respPromotions] = await Promise.all([
      axios.get(`${PROMOTION_URL}/${DIRECTORY_GROUPS.PROMOTIONS}`)
    ]);

    promotions.value = respPromotions.data.data;
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
