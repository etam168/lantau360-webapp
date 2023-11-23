<template>
  <div>
    <div v-for="item in moreItems" :key="item.Title" class="q-ma-lg">
      <!-- Display the group name outside the card -->
      <div class="row-cards">
        <q-card class="shadow-6 q-mt-sm q-pa-sm" style="border-radius: 12px">
          <q-item class="q-pa-sm">
            <q-item-section top avatar>
              <img :src="item.Icon" style="height: 35px; width: 35px" />

              <!-- <q-avatar class="" size="30px" style="color: green"> -->

              <!-- Display the icon -->
              <!-- </q-avatar> -->
            </q-item-section>

            <q-item-section top class="q-mt-sm">
              <!-- Display the title and subtitle -->
              <q-item-label class="text-subtitle1 text-weight-medium">{{
                item.Title
              }}</q-item-label>
            </q-item-section>
            <!-- Other sections as needed -->
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
  import data from "./data/data.json";
  import { MoreItem } from "@/interfaces/models/entities/moreItem";
  // Custom Components

  // const moreItems = ref<any | null>(null);
  const moreItems = ref<MoreItem[]>([]);

  onMounted(() => {
    loadData();
  });

  function loadData() {
    try {
      // Assuming 'data' is an array of objects representing FavoriteItem
      moreItems.value = data as MoreItem[];
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }
</script>
