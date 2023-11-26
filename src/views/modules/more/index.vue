<template>
  <div>
    <div v-for="item in moreItems" :key="item.Title" class="q-ma-lg">
      <div class="row-cards">
        <q-card class="shadow-6 q-mt-sm q-pa-sm" style="border-radius: 12px">
          <q-item clickable class="q-pa-sm" @click="showContent(item)">
            <q-item-section top avatar>
              <img :src="item.Icon" style="height: 35px; width: 35px" />
            </q-item-section>

            <q-item-section top class="q-mt-sm">
              <q-item-label class="text-subtitle1 text-weight-medium">
                {{ $t(item.Title) }}</q-item-label
              >
            </q-item-section>
            <q-item-section side v-if="item.Route == 'language'">
              <language-select class="q-mr-md" @on-language="onLanguageChange" />
            </q-item-section>

            <q-item-section side v-if="item.Route == 'location_permission'">
              <q-toggle v-model="locationPermission" color="green" />
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from "vue";
  import { useI18n } from "vue-i18n";
  import data from "./data/data.json";
  import { MoreItem } from "@/interfaces/models/entities/moreItem";
  import axios, { AxiosError } from "axios";
  import { useRouter } from "vue-router";

  //Custom Components
  import LanguageSelect from "@/components/language-select.vue";
  import { Content } from "@/interfaces/content";

  const moreItems = ref<MoreItem[]>([]);
  const router = useRouter();

  const { locale } = useI18n({ useScope: "global" });
  const content = ref();
  const locationPermission = ref(false);

  const loadContent = async (resKey: string) => {
    try {
      const url = `/Content/ContentByName/${resKey}`;
      const response = await axios.get<Content>(url);
      content.value = response.data.contentData;
      return content.value;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          // Handle 404 error
          console.error("Content not found");
        } else {
          // Handle other errors
          console.error("An error occurred while fetching content");
        }
      } else {
        // Handle unexpected errors
        console.error("An unexpected error occurred");
      }
      return null; // Return null or handle error based on your requirement
    }
  };

  const showContent = (item: MoreItem) => {
    switch (item.ResKey) {
      case "about_us":
        router.push(item.Route);
        break;
      case "tnc":
        router.push(item.Route);
        break;
      case "privacy_policy":
        router.push(item.Route);
        break;
      default:
    }
  };

  onMounted(() => {
    loadData();
    loadContent("");
  });

  function loadData() {
    try {
      moreItems.value = data as MoreItem[];
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  function onLanguageChange() {
    // emit("update-language", locale.value);
  }

  watch(locale, (value: any) => {
    localStorage.setItem("locale", value);
  });
</script>