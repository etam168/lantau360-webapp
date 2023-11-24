<template>
  <div>
    <div v-for="(items, groupName) in groupedItems" :key="groupName" class="q-ma-lg">
      <q-item-label class="text-weight-medium text-h6">{{ groupName }}</q-item-label>

      <!-- Display the group name outside the card -->
      <div class="row-cards">
        <q-card
          v-for="item in items"
          :key="item.itemId"
          class="shadow-6 q-mt-sm"
          style="border-radius: 12px"
        >
          <q-item class="q-pa-sm">
            <q-item-section top avatar>
              <q-avatar
                class="q-pa-none"
                size="60px"
                style="border-radius: 0px; border: 1px solid rgba(0, 0, 0, 0.12)"
              >
                <!-- <q-img :src="getImageSrc(item.iconPath)" /> -->
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
  import { ref, onMounted } from "vue";

  // 3rd Party Import

  // .ts file
  import { FavoriteItem } from "@/interfaces/models/entities/favoriteItem";
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";
  import { LocalStorage } from "quasar";

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES));
  const groupedItems = ref<Record<string, FavoriteItem[]>>({});

  onMounted(() => {
    groupItemsByDirectory();
  });

  function groupItemsByDirectory() {
    groupedItems.value = favoriteItems.value.reduce(
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

  function getImageSrc(iamgePath: any) {
    return `${BLOB_URL}/${iamgePath}`;
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
</script>
