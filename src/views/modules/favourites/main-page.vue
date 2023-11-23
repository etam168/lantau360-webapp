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
                rounded
                style="border-radius: 10px; border: 1px solid rgba(0, 0, 0, 0.12)"
              >
                <!-- <q-img :src="getImageSrc(item.iconPath)" /> -->
                <div :style="getAvatarStyle(item.iconPath)"></div>
              </q-avatar>
            </q-item-section>

            <q-item-section top class="q-mt-md">
              <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
                item.itemName
              }}</q-item-label>
              <q-item-label class="text-caption" lines="1" style="font-family: baloo">
                {{ item.subTitle }}
              </q-item-label>
            </q-item-section>
            <q-item-section side class="q-ma-lg">
              <i class="fa-solid fa-heart text-h6" style="color: lightgray; margin-top: -20px"></i>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
  </div>

  <!-- <q-card class="shadow-6" style="border-radius: 12px">
    <q-item class="q-pa-sm">
      <q-item-section top avatar>
        <q-avatar
          size="60px"
          rounded
          style="border-radius: 10px; border: 1px solid rgba(0, 0, 0, 0.12)"
        >
          <img :src="rowData.iconPath" />
        </q-avatar>
      </q-item-section>

      <q-item-section top class="q-mt-md">
        <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
          rowData.businessName
        }}</q-item-label>
        <q-item-label class="text-caption" lines="1" style="font-family: baloo">
          {{ rowData.subtitle1 }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
  <div class="text-h6 text-weight-regular q-my-sm">Contact Detail</div>
  <q-card class="shadow-6" style="border-radius: 12px">
    <q-card-section class="q-pa-none">
      <q-item class="q-pa-sm">
        <q-item-section>
          <q-icon name="mdi-phone-in-talk" color="green" size="20px" />
          <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
            $t("business.columns.phone")
          }}</q-item-label>
          <q-item-label class="text-caption" lines="1" style="font-family: baloo">
            {{ rowData.contactPhone }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="mdi-whatsapp" color="green" size="20px" />
          <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
            $t("business.columns.whatsApp")
          }}</q-item-label>
          <q-item-label class="text-caption" lines="1" style="font-family: baloo">
            {{ rowData.contactWhatsApp }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
  <div class="text-h6 text-weight-regular q-my-sm">Latitude & Longitude</div>
  <q-card class="shadow-6" style="border-radius: 12px">
    <q-card-section class="q-pa-none">
      <q-item class="q-pa-sm">
        <q-item-section>
          <q-icon name="mdi-latitude" color="green" size="20px" />
          <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
            $t("business.columns.latitude")
          }}</q-item-label>
          <q-item-label class="text-caption" lines="1" style="font-family: baloo">
            {{ rowData.latitude }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="mdi-longitude" color="green" size="20px" />
          <q-item-label class="text-subtitle1" style="font-family: balooMedium">{{
            $t("business.columns.longitude")
          }}</q-item-label>
          <q-item-label class="text-caption" lines="1" style="font-family: baloo">
            {{ rowData.longitude }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card> -->
</template>
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { ref, onMounted } from "vue";

  // 3rd Party Import

  // .ts file
  import data from "./data/data.json";
  import { FavoriteItem } from "@/interfaces/models/entities/favoriteItem";
  import { BLOB_URL } from "@/constants";
  // Custom Components

  // const favoriteItems = ref<any | null>(null);
  const favoriteItems = ref<FavoriteItem[]>([]);
  const groupedItems = ref<Record<string, FavoriteItem[]>>({});

  const directoriesData = ref();
  const error = ref<string | null>(null);

  onMounted(() => {
    loadData();
  });

  function loadData() {
    try {
      // Assuming 'data' is an array of objects representing FavoriteItem
      favoriteItems.value = data as FavoriteItem[];
      groupItemsByDirectory();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  function groupItemsByDirectory() {
    groupedItems.value = favoriteItems.value.reduce(
      (acc, item) => {
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
