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
              <q-item-label class="text-subtitle1 text-weight-medium">{{
                item.Title
              }}</q-item-label>
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

  const moreItems = ref<MoreItem[]>([]);
  const $q = useQuasar();

  const { locale } = useI18n({ useScope: "global" });

  const showBottomSheet = (item: MoreItem) => {
    if (item.ResKey === "language_settings") {
      $q.bottomSheet({
        dark: true,
        message: "Bottom Sheet message",
        grid: true,
        actions: [
          { label: " En", value: "en", onClick: () => changeLanguage("en") },
          { label: "繁", value: "hk", onClick: () => changeLanguage("hk") },
          { label: "简", value: "cn", onClick: () => changeLanguage("cn") }
        ]
      })
        .onOk(action => {
          console.log("Action chosen:", action.label);
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
