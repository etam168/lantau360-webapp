<template>
  <q-page>
    <app-page-title :title="$t('favourite.title')"></app-page-title>

    <carousel-section :data="promotions" />
    <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

    <div>
      <div v-for="(items, groupName) in filteredGroupedItems" :key="groupName" class="q-pa-md">
        <q-item-label class="text-weight-medium text-h6">{{ groupName }}</q-item-label>

        <!-- Display the group name outside the card -->
        <q-item
          clickable
          v-for="item in items"
          :key="item?.directoryId"
          class="shadow-1 q-mb-md q-pl-sm"
          @click="onItemClick(item)"
        >
          <q-item-section avatar>
            <q-avatar size="64px" square>
              <q-img ratio="1" :src="computePath(item.iconPath)" />
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-negative text-white">
                  Cannot load image
                </div>
              </template>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item?.itemName }}</q-item-label>
            <q-item-label>{{ item?.subTitle }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon
              v-if="isFavoriteItem(item?.itemId)"
              name="favorite"
              size="2em"
              color="red"
              class="favorite-icon"
            />
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { defineAsyncComponent, ref, onMounted, computed } from "vue";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { FavoriteItem } from "@/interfaces/models/entities/favoriteItem";
  import {
    URL,
    BLOB_URL,
    DIRECTORY_GROUPS,
    STORAGE_KEYS,
    BUSINESS_GALLERY_URL,
    SITE_GALLERY_URL
  } from "@/constants";
  import { LocalStorage, useQuasar } from "quasar";
  import { useRouter } from "vue-router";
  import { useI18n } from "vue-i18n";
  import eventBus from "@/utils/event-bus";

  const CarouselSection = defineAsyncComponent(() => import("./section/carousel-section.vue"));
  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES));
  const groupedItems = ref<Record<string, FavoriteItem[]>>({});
  const promotions = ref<any | null>(null);
  const error = ref<string | null>(null);
  const router = useRouter();

  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const itemImage = ref();

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
    let dialogComponent = null;
    let query = null;

    switch (item.groupId) {
      case DIRECTORY_GROUPS.HOME:
        dialogComponent = defineAsyncComponent(
          () => import("./section/dialog/site-detail-dialog.vue")
        );
        query = { siteId: item.itemId };
        break;
      case DIRECTORY_GROUPS.BUSINESS:
        dialogComponent = defineAsyncComponent(
          () => import("./section/dialog/business-detail-dialog.vue")
        );
        query = { businessId: item.itemId };
        break;
      default:
        // Handle other cases or provide a default dialog component and query
        break;
    }

    if (dialogComponent) {
      $q.dialog({
        component: dialogComponent,
        componentProps: {
          query: query
        }
      });
    }
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

  try {
    const [respPromotions] = await Promise.all([axios.get(`${URL.ADVERTISEMENT}`)]);

    promotions.value = respPromotions.data;
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

  onMounted(() => {
    loadData();
  });

  eventBus.on("favoriteUpdated", ({ itemId, isFavorite }) => {
    const itemIndex = favoriteItems.value.findIndex((item: any) => item.directoryId === itemId);

    if (itemIndex !== -1) {
      if (!isFavorite) {
        // Remove the item if it's no longer a favorite
        favoriteItems.value.splice(itemIndex, 1);
      }
    } else {
      if (isFavorite) {
        // Add the item if it's newly favorited
        favoriteItems.value.push({
          directoryId: itemId
          // other properties as needed
        });
      }
    }
  });

  const loadData = async () => {
    try {
      let galleryUrl = "";
      if (tab.value === "location") {
        galleryUrl = SITE_GALLERY_URL;
      } else if (tab.value === "business") {
        // Assuming there is a communityNewsId property in the first item of groupedItems
        const communityNewsId = groupedItems.value[Object.keys(groupedItems.value)[0]][0]?.itemId;
        galleryUrl = `${BUSINESS_GALLERY_URL}/${communityNewsId}`;
      }

      const [galleryResponse] = await Promise.all([axios.get<GalleryImage[]>(galleryUrl)]);

      // Assuming itemImage is a ref or reactive variable
      itemImage.value = galleryResponse.data[0].imagePath;
    } catch (err) {
      // ... your existing error handling ...
    }
  };

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };

  const isFavoriteItem = (siteId: string | number): boolean => {
    return favoriteItems.value.some((item: any) => item.directoryId === siteId);
  };
</script>
