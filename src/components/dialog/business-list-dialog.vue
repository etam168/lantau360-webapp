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
  import { STORAGE_KEYS } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { PropType, computed, defineAsyncComponent, onMounted, ref } from "vue";
  import { useDialogPluginComponent, useQuasar } from "quasar";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { useUtilities } from "@/composable/use-utilities";
  import { LocalStorage } from "quasar";
  import eventBus from "@/utils/event-bus";

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.BUSINESSFAVOURITES) || []);

  const $q = useQuasar();
  const { translate } = useUtilities();

  const isDialogVisible = ref();

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  const props = defineProps({
    directoryItemsList: {
      type: Array as () => Business[]
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
    eventBus.on("BusinessListDialog", () => {
      isDialogVisible.value = false;
    });
  });

  eventBus.on("favoriteUpdated", ({ businessId, isFavorite }) => {
    const itemIndex = favoriteItems.value.findIndex((item: any) => item.businessId === businessId);

    if (itemIndex !== -1) {
      if (!isFavorite) {
        // Remove the item if it's no longer a favorite
        favoriteItems.value.splice(itemIndex, 1);
      }
    } else {
      if (isFavorite) {
        // Add the item if it's newly favorited
        favoriteItems.value.push({
          businessId: businessId
          // other properties as needed
        });
      }
    }
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "BusinessListDialog");
  }

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/business-detail-dialog.vue")
      ),
      componentProps: {
        query: { businessId: item.businessId }
      }
    });
  }
</script>

<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
