<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <app-directory-item-list
            @item-click="onItemClick"
            :directoryItems="directoryItems"
            :favoriteItems="favoriteItems"
          />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent, useQuasar, LocalStorage } from "quasar";

  import { STORAGE_KEYS } from "@/constants";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { Site } from "@/interfaces/models/entities/site";
  import eventBus from "@/utils/event-bus";

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const { translate } = useUtilities();

  const $q = useQuasar();
  const isDialogVisible = ref();

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.SITEFAVOURITES) || []);

  const props = defineProps({
    directoryItemsList: {
      type: Array as PropType<Site[]>,
      required: true
    },
    directory: {
      type: Object as PropType<Directory>,
      required: true
    }
  });

  const directoryItems = computed(() => {
    return props.directoryItemsList;
  });

  const dialogTitle = computed(() => {
    return translate(props.directory.directoryName, props.directory.meta, "directoryName");
  });

  onMounted(() => {
    eventBus.on("SiteListDialog", () => {
      isDialogVisible.value = false;
    });
  });

  // eventBus.on("favoriteUpdated", ({ siteId, isFavorite }) => {
  //   const itemIndex = favoriteItems.value.findIndex((item: any) => item.siteId === siteId);

  //   if (itemIndex !== -1) {
  //     if (!isFavorite) {
  //       // Remove the item if it's no longer a favorite
  //       favoriteItems.value.splice(itemIndex, 1);
  //     }
  //   } else {
  //     if (isFavorite) {
  //       // Add the item if it's newly favorited
  //       favoriteItems.value.push({
  //         siteId: siteId
  //         // other properties as needed
  //       });
  //     }
  //   }
  // });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "SiteListDialog");
  }

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("./site-detail-dialog.vue")),
      componentProps: {
        query: { siteId: item.siteId }
      }
    });
  }
</script>
