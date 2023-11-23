<template>
  <div>
    <bottom-dialogue-language />
    <div v-for="item in moreItems" :key="item.Title" class="q-ma-lg">
      <!-- Display the group name outside the card -->
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
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import data from "./data/data.json";
  import { MoreItem } from "@/interfaces/models/entities/moreItem";
  import BottomDialogueLanguage from "./bottom-dialogue-language.vue";

  const moreItems = ref<MoreItem[]>([]);
  const $q = useQuasar();

  const showBottomSheet = (item: MoreItem) => {
    if (item.ResKey === "language_settings") {
      $q.bottomSheet({
        dark: true,
        message: "Bottom Sheet message",
        grid: true,
        actions: [
          { label: "Drive", img: "https://cdn.quasar.dev/img/logo_drive_128px.png", id: "drive" },
          { label: "Keep", img: "https://cdn.quasar.dev/img/logo_keep_128px.png", id: "keep" },
          {
            label: "Google Hangouts",
            img: "https://cdn.quasar.dev/img/logo_hangouts_128px.png",
            id: "calendar"
          },
          {
            label: "Calendar",
            img: "https://cdn.quasar.dev/img/logo_calendar_128px.png",
            id: "calendar"
          },
          {},
          { label: "Share", icon: "share", id: "share" },
          { label: "Upload", icon: "cloud_upload", color: "primary", id: "upload" },
          {},
          { label: "John", avatar: "https://cdn.quasar.dev/img/boy-avatar.png", id: "john" }
        ]
      })
        .onOk(action => {
          console.log("Action chosen:", action.id);
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
</script>
