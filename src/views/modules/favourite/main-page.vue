<template>
  <q-page>
    <app-carousel-section :data="advertisements" />

    <q-toolbar class="q-mt-sm" v-if="$q.screen.lt.sm">
      <div class="column items-center" style="width: 100%">
        <q-toolbar-title class="text-center text-h6 q-pa-none">{{
          $t("favourite.title")
        }}</q-toolbar-title>
        <app-tab-select
          class="justify-center"
          :tab-items="tabItems"
          :current-tab="tab"
          @update:currentTab="setTab"
        />
      </div>
    </q-toolbar>

    <q-toolbar class="q-mt-sm" v-else>
      <q-toolbar-title>{{ $t("favourite.title") }}</q-toolbar-title>
      <div>
        <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />
      </div>
    </q-toolbar>

    <app-tab-panels v-model="tab">
      <q-tab-panel name="location" class="q-pa-none">
        <app-grouped-item-list :list-items="siteItems" />
      </q-tab-panel>

      <q-tab-panel name="business" class="q-pa-none">
        <app-grouped-item-list :list-items="businessItems" />
      </q-tab-panel>

      <q-tab-panel name="coupon">
        <div>Coupon</div>
      </q-tab-panel>
    </app-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // Interface files
  import { Business } from "@/interfaces/models/entities/business";
  import { Site } from "@/interfaces/models/entities/site";

  // .ts file
  import { URL, STORAGE_KEYS } from "@/constants";

  const { eventBus } = useUtilities();

  const siteItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) ?? []) as Site[];
  });

  const businessItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) ?? []) as Business[];
  });

  const advertisements = ref<any | null>(null);
  const error = ref<string | null>(null);

  const { t } = useI18n({ useScope: "global" });

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("location");
  const tabItems = ref([
    { name: "location", label: t("favourite.tabItems.location") },
    { name: "business", label: t("favourite.tabItems.business") },
    { name: "coupon", label: t("favourite.tabItems.coupon") }
  ]);

  eventBus.on("favoriteUpdated", ({ itemId, isFavorite, moduleType }) => {
    let itemsArray;

    switch (moduleType) {
      case "business":
        itemsArray = businessItems;
        break;
      case "site":
        itemsArray = siteItems;
        break;
      // Add more cases if needed for other modules

      default:
        // Handle default case if necessary
        break;
    }

    // Check if itemsArray is defined before accessing its value property
    const itemIndex = itemsArray?.value?.findIndex((item: any) => item.directoryId === itemId);

    if (itemIndex !== undefined && itemIndex !== -1) {
      if (!isFavorite) {
        // Remove the item if it's no longer a favorite
        itemsArray?.value.splice(itemIndex, 1);
      }
    } else {
      if (isFavorite) {
        const newItem = {
          directoryId: itemId
        } as Site & Business;

        itemsArray?.value.push(newItem);
      }
    }
  });

  try {
    const [advertisementResponse] = await Promise.all([axios.get(`${URL.ADVERTISEMENT}`)]);
    advertisements.value = advertisementResponse.data;
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
