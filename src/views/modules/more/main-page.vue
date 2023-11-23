<template>
  <div>
    <div v-for="item in moreItems" :key="item.Title" class="q-ma-lg">
      <div class="row-cards">
        <q-card class="shadow-6 q-mt-sm q-pa-sm" style="border-radius: 12px">
          <q-item clickable class="q-pa-sm" @click="showBottomSheet(item)">
            <q-item-section top avatar>
              <img :src="item.Icon" style="height: 35px; width: 35px" />
            </q-item-section>

            <q-item-section top class="q-mt-sm">
              <q-item-label class="text-subtitle1 text-weight-medium">
                {{ $t(item.Title) }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from "vue";
  import { useQuasar } from "quasar";
  import { useI18n } from "vue-i18n";
  import data from "./data/data.json";
  import { MoreItem } from "@/interfaces/models/entities/moreItem";
  import i18n from "@/plugins/i18n/i18n";
  import axios, { AxiosError } from "axios";

  const moreItems = ref<MoreItem[]>([]);
  const $q = useQuasar();
  const { t } = i18n.global;

  const { locale } = useI18n({ useScope: "global" });
  const content = ref();

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

  const shouldShowBottomSheet = (item: MoreItem) => {
    return ["language_settings", "about_us", "tnc", "privacy_policy"].includes(item.ResKey);
  };

  const showBottomSheet = (item: MoreItem) => {
    if (shouldShowBottomSheet(item)) {
      let actions;
      let message = "";
      let grid = true;

      switch (item.ResKey) {
        case "language_settings":
          actions = [
            { label: "En", value: "en", onClick: () => changeLanguage("en") },
            { label: "繁", value: "hk", onClick: () => changeLanguage("hk") },
            { label: "简", value: "cn", onClick: () => changeLanguage("cn") }
          ];
          message = t("more.language");
          grid = true;
          break;
        case "about_us":
          actions = [
            {
              label: content.value,
              value: loadContent("About")
            }
          ];
          message = t("more.aboutUs");
          grid = false;
          break;
        case "tnc":
          // Customize actions for terms and conditions
          actions = [
            {
              label: content.value,
              value: loadContent("Terms")
            }
          ];
          message = t("more.termsConditions");
          grid = false;
          break;
        case "privacy_policy":
          // Customize actions for privacy policy
          actions = [
            {
              label: content.value,
              value: loadContent("Privacy")
            }
          ];
          message = t("more.privacyPolicy");
          grid = false;
          break;
        default:
          actions = [];
      }

      $q.bottomSheet({
        dark: true,
        message,
        grid,
        actions
      })
        .onOk(action => {
          console.log("Action chosen:", action.value);
          changeLanguage(action.value);
        })
        .onCancel(() => {
          // console.log('Dismissed')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
  };

  onMounted(() => {
    loadData();
    loadContent();
  });

  function loadData() {
    try {
      moreItems.value = data as MoreItem[];
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  const changeLanguage = (language: string) => {
    locale.value = language;
  };

  watch(locale, (value: any) => {
    localStorage.setItem("locale", value);
  });
</script>
