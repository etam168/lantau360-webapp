<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-mx-md q-my-md">
        <app-page-title :title="$t('more.title')"></app-page-title>

        <q-item
          v-for="item in moreItems"
          :key="item.Title"
          clickable
          @click="showContentDialog(item)"
          class="shadow-1 q-mb-md q-pl-sm"
        >
          <q-item-section avatar>
            <q-avatar size="38px" square>
              <q-img ratio="1" :src="item.Icon" />
            </q-avatar>
          </q-item-section>

          <q-item-section class="q-ml-lg">
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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, defineAsyncComponent } from "vue";
  import { useI18n } from "vue-i18n";
  import data from "./data/data.json";
  import { MoreItem } from "@/interfaces/models/entities/moreItem";
  import axios, { AxiosError } from "axios";
  //import eventBus from "@/utils/event-bus";
  //import { useRouter } from "vue-router";

  // 3rd Party Import
  import { useQuasar } from "quasar";

  //Custom Components
  import LanguageSelect from "@/components/language-select.vue";
  import { Content } from "@/interfaces/content";

  const moreItems = ref<MoreItem[]>([]);
  //const router = useRouter();
  const $q = useQuasar();

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

  // const showContent = (item: MoreItem) => {
  //   switch (item.ResKey) {
  //     case "about_us":
  //       router.push(item.Route);
  //       break;
  //     case "tnc":
  //       router.push(item.Route);
  //       break;
  //     case "privacy_policy":
  //       router.push(item.Route);
  //       break;
  //     default:
  //   }
  // };

  // showContent;

  function showContentDialog(item: any) {
    switch (item.ResKey) {
      case "about_us":
        showContentDialogByName("About");
        break;
      case "tnc":
        showContentDialogByName("Terms");
        break;
      case "privacy_policy":
        showContentDialogByName("Privacy");
        break;
      default:
        break;
    }
  }

  function showContentDialogByName(contentName: string) {
    $q.dialog({
      component: defineAsyncComponent(() => import("../content/index.vue")),
      componentProps: {
        contentNameValue: contentName
      }
    });
  }

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
